import base64
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from services.content_service import load_content, build_system_prompt, estimate_token_count
from services.stt_service     import transcribe_audio_file
from services.llm_service     import (
    classify_intent,
    evaluate_story_answer,
    get_answer,
    preload_embedding_model_async,
)
from services.tts_service     import synthesize_speech
from services.session_service import SessionManager, add_turn, clear_history, format_for_display
from services.story_service   import (
    StorySessionManager,
    build_feedback_with_next_question,
    build_question_text,
    get_question,
    load_story,
)

app = FastAPI(title="CoTich Voice Bot")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo quản lý phiên đa người dùng bất đồng bộ
session_manager = SessionManager()
story_session_manager = StorySessionManager()
GLOBAL_SYSTEM_PROMPT = ""
STORY_DATA = None


@app.on_event("startup")
async def startup_preload_models():
    model_name = await preload_embedding_model_async()
    print(f"[EMBEDDING] Loaded: {model_name}", flush=True)


def _encode_json_header(data: dict) -> str:
    raw = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    return base64.urlsafe_b64encode(raw).decode("ascii")


def _story_audio_response(path: str, meta: dict):
    return FileResponse(
        path,
        media_type="audio/wav",
        filename="story.wav",
        headers={"X-Story-Meta": _encode_json_header(meta)},
    )


def _load_story_data() -> dict:
    global STORY_DATA
    STORY_DATA = load_story()
    return STORY_DATA


# ════════════════════════════════════════════════════════
# HEALTH
# ════════════════════════════════════════════════════════

@app.get("/", tags=["system"])
async def root():
    session = await session_manager.get_or_create_session("default", GLOBAL_SYSTEM_PROMPT)
    async with session.lock:
        turns = len(session.history) // 2
    return {
        "status" : "ok",
        "content": "loaded" if GLOBAL_SYSTEM_PROMPT else "empty",
        "turns"  : turns,
    }


# ════════════════════════════════════════════════════════
# CONTENT
# ════════════════════════════════════════════════════════

class ContentInput(BaseModel):
    content: str

@app.post("/api/load-content", tags=["system"])
async def load_content_api(body: ContentInput):
    global GLOBAL_SYSTEM_PROMPT
    cleaned               = load_content(body.content)
    GLOBAL_SYSTEM_PROMPT = build_system_prompt(cleaned)
    # Xóa và tạo mới mặc định session để giải phóng bộ nhớ
    await session_manager.clear_session("default")
    await session_manager.get_or_create_session("default", GLOBAL_SYSTEM_PROMPT)
    return {
        "status"        : "ok",
        "chars"         : len(cleaned),
        "token_estimate": estimate_token_count(cleaned),
    }

@app.post("/api/reset", tags=["system"])
async def reset_api():
    global GLOBAL_SYSTEM_PROMPT
    GLOBAL_SYSTEM_PROMPT = ""
    await session_manager.clear_session("default")
    return {"status": "cleared"}


# ════════════════════════════════════════════════════════
# STT
# ════════════════════════════════════════════════════════

@app.post("/api/transcribe", tags=["stt"])
async def transcribe_api(audio: UploadFile = File(...)):
    """Nhận file audio, chuẩn hóa biên độ động thích ứng và transcribe bất đồng bộ."""
    audio_bytes = await audio.read()
    text = await transcribe_audio_file(audio_bytes)
    return {"text": text}


# ════════════════════════════════════════════════════════
# TTS
# ════════════════════════════════════════════════════════

class TTSInput(BaseModel):
    text : str
    style: str = ""

@app.post("/api/speak", tags=["tts"])
async def speak_api(body: TTSInput):
    """Nhận text, trả về file WAV từ cache hoặc tạo mới bất đồng bộ."""
    path = await synthesize_speech(body.text, style=body.style)
    if not path:
        raise HTTPException(500, "TTS thất bại")
    return FileResponse(path, media_type="audio/wav", filename="reply.wav")


# ════════════════════════════════════════════════════════
# STORY QUESTION FLOW
# ════════════════════════════════════════════════════════

@app.post("/api/story/start", tags=["story"])
async def story_start_api(session_id: str = "default"):
    """
    Load story.json, reset session câu hỏi và đọc câu hỏi đầu tiên bằng TTS.
    Metadata nằm trong header X-Story-Meta dạng base64 JSON UTF-8.
    """
    try:
        story = _load_story_data()
    except Exception as e:
        raise HTTPException(400, str(e))

    story_session = await story_session_manager.reset_session(session_id)
    async with story_session.lock:
        question = get_question(story, story_session.question_index)
        if not question:
            raise HTTPException(400, "story.json chưa có câu hỏi.")
        question_text = build_question_text(story, question, story_session.question_index)

    path = await synthesize_speech(question_text, style="cau_hoi")
    if not path:
        raise HTTPException(500, "TTS thất bại")

    return _story_audio_response(path, {
        "status": "started",
        "story": story["story"],
        "session_id": session_id,
        "question_index": 1,
        "total_questions": len(story["questions"]),
        "question_id": question["id"],
        "question": question["question"],
        "completed": False,
    })


@app.get("/api/story/status", tags=["story"])
async def story_status_api(session_id: str = "default"):
    """Lấy trạng thái câu hỏi hiện tại của session."""
    story = STORY_DATA or _load_story_data()
    story_session = await story_session_manager.get_or_create_session(session_id)
    async with story_session.lock:
        question = get_question(story, story_session.question_index)
        return {
            "story": story["story"],
            "session_id": session_id,
            "question_index": story_session.question_index + 1,
            "total_questions": len(story["questions"]),
            "question": question["question"] if question else "",
            "completed": story_session.completed,
        }


@app.post("/api/story/answer", tags=["story"])
async def story_answer_api(audio: UploadFile = File(...), session_id: str = "default"):
    """
    Nhận audio câu trả lời của bé, STT, chấm bằng LLM, trả audio phản hồi.
    Sau mỗi câu trả lời, service tự chuyển sang câu hỏi kế tiếp.
    """
    story = STORY_DATA or _load_story_data()
    story_session = await story_session_manager.get_or_create_session(session_id)
    audio_bytes = await audio.read()

    already_completed = False
    async with story_session.lock:
        if story_session.completed:
            already_completed = True
            question_index = None
            question = None
        else:
            question_index = story_session.question_index
            question = get_question(story, question_index)
            if not question:
                story_session.completed = True
                raise HTTPException(400, "Không tìm thấy câu hỏi hiện tại.")

    user_text = await transcribe_audio_file(audio_bytes)

    if not already_completed:
        async with story_session.lock:
            if story_session.completed:
                already_completed = True
            else:
                question_index = story_session.question_index
                question = get_question(story, question_index)
                if not question:
                    story_session.completed = True
                    raise HTTPException(400, "Không tìm thấy câu hỏi hiện tại.")

                evaluation = await evaluate_story_answer(
                    question=question["question"],
                    correct_answer=question["answer"],
                    user_answer=user_text,
                    story_title=story["story"],
                )

                story_session.question_index += 1
                next_question = get_question(story, story_session.question_index)
                story_session.completed = next_question is None

                next_question_text = ""
                if next_question:
                    next_question_text = build_question_text(
                        story,
                        next_question,
                        story_session.question_index,
                    )
                reply_text = build_feedback_with_next_question(
                    evaluation["feedback"],
                    next_question_text=next_question_text,
                    completed=story_session.completed,
                )
                completed = story_session.completed

    if already_completed:
        reply_text = "Tớ và cậu đã hoàn thành tất cả câu hỏi rồi. Cậu làm tốt lắm!"
        path = await synthesize_speech(reply_text, style="ket_thuc")
        if not path:
            raise HTTPException(500, "TTS thất bại")
        return _story_audio_response(path, {
            "status": "completed",
            "story": story["story"],
            "session_id": session_id,
            "transcript": user_text,
            "completed": True,
        })

    style = "khen" if evaluation["is_correct"] else "sai"
    if completed:
        style = "ket_thuc"
    path = await synthesize_speech(reply_text, style=style)
    if not path:
        raise HTTPException(500, "TTS thất bại")

    return _story_audio_response(path, {
        "status": "answered",
        "story": story["story"],
        "session_id": session_id,
        "transcript": user_text,
        "answered_question_index": question_index + 1,
        "answered_question_id": question["id"],
        "score": evaluation["score"],
        "is_correct": evaluation["is_correct"],
        "feedback": evaluation["feedback"],
        "next_question_index": story_session.question_index + 1 if next_question else None,
        "next_question_id": next_question["id"] if next_question else None,
        "next_question": next_question["question"] if next_question else "",
        "completed": completed,
    })


# ════════════════════════════════════════════════════════
# CHAT
# ════════════════════════════════════════════════════════

class ChatInput(BaseModel):
    message: str

@app.post("/api/chat", tags=["chat"])
async def chat_api(body: ChatInput):
    """Gửi text nhận phản hồi dạng text của bạn đồng hành bất đồng bộ."""
    if not GLOBAL_SYSTEM_PROMPT:
        raise HTTPException(400, "Chưa load nội dung. Gọi /api/load-content trước.")
    
    session = await session_manager.get_or_create_session("default", GLOBAL_SYSTEM_PROMPT)
    async with session.lock:
        reply = await get_answer(body.message, session.system_prompt, session.history)
        session.history = add_turn(session.history, body.message, reply)
        
    return {"reply": reply}


class ClassifyInput(BaseModel):
    current_question: str
    user_text       : str

class AnswerEvalInput(BaseModel):
    story_title: str = ""
    child_age: int = 0
    question: str
    child_answer: str
    correct_answer: str

@app.post("/api/classify", tags=["chat"])
async def classify_api(body: ClassifyInput):
    """Phân loại intent bất đồng bộ mạnh mẽ: ANSWER | QUESTION | CONFIRM | CONFUSED."""
    if not GLOBAL_SYSTEM_PROMPT:
        raise HTTPException(400, "Chưa load nội dung. Gọi /api/load-content trước.")
    
    intent = await classify_intent(
        body.current_question,
        body.user_text,
        GLOBAL_SYSTEM_PROMPT,
    )
    return {"intent": intent}


@app.post("/api/evaluate-answer", tags=["chat"])
async def evaluate_answer_api(body: AnswerEvalInput):
    """Chấm độ tương khớp câu trả lời của bé theo nghĩa, không bắt khớp văn mẫu."""
    evaluation = await evaluate_story_answer(
        question=body.question,
        correct_answer=body.correct_answer,
        user_answer=body.child_answer,
        story_title=body.story_title,
    )
    return evaluation


class ChatSpeakInput(BaseModel):
    message: str
    style  : str = ""

@app.post("/api/chat-speak", tags=["chat"])
async def chat_speak_api(body: ChatSpeakInput):
    """Trò chuyện và trả về âm thanh bạn đồng hành trong cùng 1 request bất đồng bộ."""
    if not GLOBAL_SYSTEM_PROMPT:
        raise HTTPException(400, "Chưa load nội dung. Gọi /api/load-content trước.")
    
    session = await session_manager.get_or_create_session("default", GLOBAL_SYSTEM_PROMPT)
    async with session.lock:
        reply = await get_answer(body.message, session.system_prompt, session.history)
        session.history = add_turn(session.history, body.message, reply)
        
    path = await synthesize_speech(reply, style=body.style)
    if not path:
        raise HTTPException(500, "TTS thất bại")
        
    return FileResponse(path, media_type="audio/wav", filename="reply.wav",
                        headers={"X-Reply-Text": reply})


# ════════════════════════════════════════════════════════
# HISTORY
# ════════════════════════════════════════════════════════

@app.get("/api/history", tags=["chat"])
async def get_history():
    """Lấy lịch sử hội thoại hiển thị."""
    session = await session_manager.get_or_create_session("default", GLOBAL_SYSTEM_PROMPT)
    async with session.lock:
        history_copy = list(session.history)
        
    return {
        "turns"  : len(history_copy) // 2,
        "history": format_for_display(history_copy),
    }
