import asyncio
import json
import os
from typing import Dict, Optional


DEFAULT_STORY_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "story.json")
)


class StorySession:
    def __init__(self):
        self.question_index = 0
        self.completed = False
        self.lock = asyncio.Lock()


class StorySessionManager:
    def __init__(self):
        self._sessions: Dict[str, StorySession] = {}
        self._lock = asyncio.Lock()

    async def get_or_create_session(self, session_id: str) -> StorySession:
        async with self._lock:
            if session_id not in self._sessions:
                self._sessions[session_id] = StorySession()
            return self._sessions[session_id]

    async def reset_session(self, session_id: str) -> StorySession:
        async with self._lock:
            self._sessions[session_id] = StorySession()
            return self._sessions[session_id]


def load_story_from_payload(
    story_title: str,
    qa_list: list[dict],
    child_age: int = 6,
) -> dict:
    cleaned_title = str(story_title or "").strip()
    if not cleaned_title:
        raise ValueError("Payload missing 'story_title'.")

    if not isinstance(qa_list, list) or not qa_list:
        raise ValueError("Payload 'qa_list' is empty or invalid.")

    questions = []
    for idx, item in enumerate(qa_list, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"QA item #{idx} is not a dict.")
        question = str(item.get("question") or "").strip()
        answer = str(item.get("answer") or "").strip()
        if not question or not answer:
            raise ValueError(f"QA item #{idx} missing question or answer.")
        questions.append({
            "id": item.get("id", idx),
            "question": question,
            "answer": answer,
        })

    return {
        "story": cleaned_title,
        "child_age": child_age,
        "questions": questions,
        "_source": "db",
    }


def load_story(path: str = DEFAULT_STORY_PATH) -> dict:
    with open(path, "r", encoding="utf-8-sig") as f:
        data = json.load(f)

    story_title = str(data.get("story") or "").strip()
    raw_questions = data.get("questions")
    if not story_title:
        raise ValueError("story.json thiếu trường 'story'.")
    if not isinstance(raw_questions, list) or not raw_questions:
        raise ValueError("story.json cần có danh sách 'questions'.")

    questions = []
    for idx, item in enumerate(raw_questions, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"Câu hỏi #{idx} không hợp lệ.")
        question = str(item.get("question") or "").strip()
        answer = str(item.get("answer") or "").strip()
        if not question or not answer:
            raise ValueError(f"Câu hỏi #{idx} thiếu question hoặc answer.")
        questions.append({
            "id": item.get("id", idx),
            "question": question,
            "answer": answer,
        })

    return {
        "story": story_title,
        "questions": questions,
    }


def get_question(story: dict, question_index: int) -> Optional[dict]:
    questions = story["questions"]
    if 0 <= question_index < len(questions):
        return questions[question_index]
    return None


def build_question_text(story: dict, question: dict, question_index: int) -> str:
    return (
        f"Câu hỏi {question_index + 1}: "
        f"{question['question']}"
    )


def build_feedback_with_next_question(
    feedback: str,
    next_question_text: str = "",
    completed: bool = False,
) -> str:
    if completed:
        return f"{feedback} Hoàn thành hết rồi, cậu giỏi lắm!"
    if next_question_text:
        return f"{feedback} Sang câu tiếp theo: {next_question_text}"
    return feedback
