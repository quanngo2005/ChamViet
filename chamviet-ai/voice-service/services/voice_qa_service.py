import asyncio
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from services.content_service import build_system_prompt, load_content
from services.llm_service import classify_intent, evaluate_story_answer, get_answer
from services.session_service import add_turn


UNCLEAR_SCORE_THRESHOLD = 40
CORRECT_SCORE_THRESHOLD = 75
SILENT_RETRY_TEXT = "Cô chưa nghe rõ, con nói to hơn một chút nhé."


@dataclass
class VoiceQAItem:
    question: str
    answer: str


@dataclass
class VoiceQASession:
    story_title: str
    story_content: str
    child_age: int
    qa_list: List[VoiceQAItem]
    system_prompt: str
    question_index: int = 0
    score: int = 0
    completed: bool = False
    history: List[dict] = field(default_factory=list)
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)


class VoiceQASessionManager:
    def __init__(self):
        self._sessions: Dict[str, VoiceQASession] = {}
        self._lock = asyncio.Lock()

    async def start_session(
        self,
        session_id: str,
        story_title: str,
        story_content: str,
        child_age: int,
        qa_list: List[VoiceQAItem],
    ) -> VoiceQASession:
        cleaned_content = load_content(story_content)
        system_prompt = build_system_prompt(cleaned_content)
        session = VoiceQASession(
            story_title=story_title.strip(),
            story_content=cleaned_content,
            child_age=child_age,
            qa_list=qa_list,
            system_prompt=system_prompt,
        )
        async with self._lock:
            self._sessions[session_id] = session
        return session

    async def get_session(self, session_id: str) -> Optional[VoiceQASession]:
        async with self._lock:
            return self._sessions.get(session_id)

    async def clear_session(self, session_id: str):
        async with self._lock:
            self._sessions.pop(session_id, None)


def normalize_session_id(session_id: Optional[str]) -> str:
    cleaned = (session_id or "").strip()
    return cleaned or "default"


def normalize_qa_list(raw_items: list) -> List[VoiceQAItem]:
    items: List[VoiceQAItem] = []
    for raw_item in raw_items:
        question = str(getattr(raw_item, "question", "") or "").strip()
        answer = str(getattr(raw_item, "answer", "") or "").strip()
        if question and answer:
            items.append(VoiceQAItem(question=question, answer=answer))
    return items


def build_greeting_text(session: VoiceQASession) -> str:
    return (
        f"Chào con. Bây giờ mình cùng ôn lại câu chuyện {session.story_title} "
        "bằng vài câu hỏi ngắn nhé."
    )


def build_question_text(session: VoiceQASession, question_index: int) -> str:
    question = session.qa_list[question_index].question
    return f"Bây giờ là câu {question_index + 1} trên {len(session.qa_list)}. {question}"


def build_start_text(session: VoiceQASession) -> str:
    return f"{build_greeting_text(session)} {build_question_text(session, 0)}"


def build_ending_text(session: VoiceQASession) -> str:
    total = len(session.qa_list)
    if session.score == total:
        return f"Con làm rất tuyệt. Con trả lời đúng cả {total} câu rồi."
    if session.score == 0:
        return "Hôm nay con đã rất chăm lắng nghe. Lần sau mình cùng cố gắng hơn nhé."
    return f"Con đã trả lời đúng {session.score} trên {total} câu. Cô khen con đã cố gắng lắm."


def build_wrong_text(answer: str) -> str:
    return f"Con đã rất cố gắng rồi. Cô gợi ý đáp án là: {answer}. Mình sang câu tiếp theo nhé."


def build_question_prompt(session: VoiceQASession, question: str, child_question: str) -> str:
    return " ".join([
        f"Con {session.child_age} tuổi đang hỏi thêm về câu chuyện {session.story_title}.",
        f'Câu hỏi của bé là: "{child_question}".',
        "Hãy trả lời thật ngắn gọn, dễ hiểu cho trẻ em, tối đa 2 câu.",
        f'Sau đó nhắc bé quay lại trả lời câu hỏi này: "{question}".',
        "Không dùng bullet points.",
    ])


def build_confused_prompt(session: VoiceQASession, question: str, answer: str) -> str:
    return " ".join([
        f"Con {session.child_age} tuổi đang chưa biết trả lời câu hỏi trong truyện {session.story_title}.",
        f'Câu hỏi là: "{question}".',
        f'Đáp án đúng là: "{answer}".',
        "Hãy đưa ra một gợi ý ngắn, thân thiện, không nói nguyên văn toàn bộ đáp án nếu không cần thiết.",
        "Không dùng bullet points.",
    ])


def build_meta(
    session_id: str,
    session: VoiceQASession,
    text: str,
    phase: str,
    transcript: str = "",
    intent: str = "",
    is_correct: Optional[bool] = None,
    answered_question_index: Optional[int] = None,
) -> dict:
    meta = {
        "text": text,
        "phase": phase,
        "session_id": session_id,
        "question_index": session.question_index,
        "total_questions": len(session.qa_list),
        "completed": session.completed,
        "score": session.score,
    }
    if transcript:
        meta["transcript"] = transcript
    if intent:
        meta["intent"] = intent
    if is_correct is not None:
        meta["is_correct"] = is_correct
    if answered_question_index is not None:
        meta["answered_question_index"] = answered_question_index
    if not session.completed and session.question_index < len(session.qa_list):
        meta["question"] = session.qa_list[session.question_index].question
        meta["question_text"] = build_question_text(session, session.question_index)
    return meta


async def handle_answer_turn(session_id: str, session: VoiceQASession, transcript: str) -> dict:
    transcript = transcript.strip()
    if session.completed:
        text = build_ending_text(session)
        return build_meta(session_id, session, text, "done", transcript=transcript)

    if not transcript:
        return build_meta(
            session_id,
            session,
            SILENT_RETRY_TEXT,
            "listening",
            transcript=transcript,
            intent="SILENT",
            is_correct=False,
        )

    qa = session.qa_list[session.question_index]
    intent = await classify_intent(qa.question, transcript, session.system_prompt)
    normalized_intent = intent.strip().upper()

    if "QUESTION" in normalized_intent:
        prompt = build_question_prompt(session, qa.question, transcript)
        reply = await get_answer(prompt, session.system_prompt, session.history)
        session.history = add_turn(session.history, prompt, reply)
        return build_meta(session_id, session, reply, "listening", transcript=transcript, intent="QUESTION")

    if "CONFUSED" in normalized_intent:
        prompt = build_confused_prompt(session, qa.question, qa.answer)
        reply = await get_answer(prompt, session.system_prompt, session.history)
        session.history = add_turn(session.history, prompt, reply)
        return build_meta(
            session_id,
            session,
            reply,
            "listening",
            transcript=transcript,
            intent="CONFUSED",
            is_correct=False,
        )

    evaluation = await evaluate_story_answer(
        question=qa.question,
        correct_answer=qa.answer,
        user_answer=transcript,
        story_title=session.story_title,
    )
    score = float(evaluation.get("score") or 0)
    feedback = str(evaluation.get("feedback") or "").strip()
    is_correct = bool(evaluation.get("is_correct")) or score >= CORRECT_SCORE_THRESHOLD
    answered_question_index = session.question_index

    if is_correct:
        session.score += 1
        reply = feedback or "Giỏi quá, con trả lời đúng rồi."
        session.question_index += 1
        if session.question_index >= len(session.qa_list):
            session.completed = True
            reply = f"{reply} {build_ending_text(session)}"
            phase = "done"
        else:
            reply = f"{reply} {build_question_text(session, session.question_index)}"
            phase = "listening"
        return build_meta(
            session_id,
            session,
            reply,
            phase,
            transcript=transcript,
            intent="ANSWER",
            is_correct=True,
            answered_question_index=answered_question_index,
        )

    if "CONFIRM" in normalized_intent or score >= UNCLEAR_SCORE_THRESHOLD:
        reply = feedback or "Cô nghe chưa rõ ý lắm, con thử nói rõ hơn một chút nhé."
        return build_meta(
            session_id,
            session,
            reply,
            "listening",
            transcript=transcript,
            intent=normalized_intent or "ANSWER",
            is_correct=False,
            answered_question_index=answered_question_index,
        )

    reply = feedback or build_wrong_text(qa.answer)
    session.question_index += 1
    if session.question_index >= len(session.qa_list):
        session.completed = True
        reply = f"{reply} {build_ending_text(session)}"
        phase = "done"
    else:
        reply = f"{reply} {build_question_text(session, session.question_index)}"
        phase = "listening"

    return build_meta(
        session_id,
        session,
        reply,
        phase,
        transcript=transcript,
        intent="ANSWER",
        is_correct=False,
        answered_question_index=answered_question_index,
    )
