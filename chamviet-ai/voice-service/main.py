import base64
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from services.stt_service     import (
    AudioDecodingError,
    AudioInputError,
    AudioTooShortError,
    NoSpeechDetectedError,
    transcribe_audio_file,
)
from services.llm_service     import (
    classify_intent,
    evaluate_story_answer,
    get_answer,
    preload_embedding_model_async,
)
from services.tts_service     import UNIFIED_VOICE_STYLE, synthesize_speech, warm_story_tts_async
from services.session_service import SessionManager, add_turn, clear_history, format_for_display
from services.content_service import load_content, build_system_prompt, estimate_token_count
from services.story_service   import (
    StorySessionManager,
    build_question_text,
    get_question,
    load_story_from_payload,
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


@app.on_event("startup")
async def startup_preload_models():
    import asyncio
    model_name = await preload_embedding_model_async()
    print(f"[EMBEDDING] Loaded: {model_name}", flush=True)
    # Pre-warm TTS cache for story in background (non-blocking)
    try:
        story = _load_story_data()
        asyncio.create_task(warm_story_tts_async(story))
        print("[TTS-WARM] Background pre-generation started.", flush=True)
    except Exception as e:
        print(f"[TTS-WARM] Could not start warm: {e}", flush=True)


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

def _require_story_data(story: dict | None, session_id: str) -> dict:
    if story:
        return story
    raise HTTPException(
        409,
        f"Session '{session_id}' has no story payload. Start or preload the session from backend first.",
    )


async def _transcribe_or_bad_request(audio_bytes: bytes) -> str:
    try:
        text = await transcribe_audio_file(audio_bytes)
    except AudioTooShortError as exc:
        raise HTTPException(400, str(exc)) from exc
    except NoSpeechDetectedError as exc:
        raise HTTPException(400, str(exc)) from exc
    except AudioDecodingError as exc:
        raise HTTPException(400, str(exc)) from exc
    except AudioInputError as exc:
        raise HTTPException(400, str(exc)) from exc

    if not text.strip():
        raise HTTPException(400, "Không nhận diện được giọng nói trong bản ghi.")
    return text


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
    text = await _transcribe_or_bad_request(audio_bytes)
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
    path = await synthesize_speech(body.text, style=UNIFIED_VOICE_STYLE)
    if not path:
        raise HTTPException(500, "TTS thất bại")
    return FileResponse(path, media_type="audio/wav", filename="reply.wav")


# ════════════════════════════════════════════════════════
# STORY QUESTION FLOW
# ════════════════════════════════════════════════════════

class StoryStartInput(BaseModel):
    session_id: str = "default"
    story_title: str = ""
    story_content: str = ""
    child_age: int = 6
    qa_list: list[dict] = []


@app.post("/api/story/start", tags=["story"])
async def story_start_api(body: StoryStartInput = None):
    """
    Nhận payload story từ backend và khởi tạo session runtime.
    Trả về WAV audio với header X-Story-Meta dạng base64 JSON UTF-8.
    """
    if not body or not body.qa_list or not body.story_title:
        raise HTTPException(400, "Backend story payload is required for session start")

    session_id = body.session_id if body.session_id else "default"

    try:
        story = load_story_from_payload(
            story_title=body.story_title,
            qa_list=body.qa_list,
            child_age=body.child_age,
        )
    except Exception as e:
        raise HTTPException(400, str(e))

    import asyncio as _asyncio
    story_session = await story_session_manager.reset_session(session_id)
    async with story_session.lock:
        story_session.story_data = story
        question = get_question(story, story_session.question_index)
        if not question:
            raise HTTPException(400, "Story payload chưa có câu hỏi.")
        question_text = build_question_text(story, question, story_session.question_index)

    # Launch background TTS warm for remaining combos (no-op if already cached)
    _asyncio.create_task(warm_story_tts_async(story))

    path = await synthesize_speech(question_text, style=UNIFIED_VOICE_STYLE)
    if not path:
        raise HTTPException(500, "TTS thất bại")

    return _story_audio_response(path, {
        "status": "started",
        "phase": "listening",
        "story": story["story"],
        "session_id": session_id,
        "question_index": story_session.question_index,
        "total_questions": len(story["questions"]),
        "question_id": question["id"],
        "question": question["question"],
        "text": question_text,
        "question_text": question_text,
        "completed": False,
    })


@app.get("/api/story/status", tags=["story"])
async def story_status_api(session_id: str = "default"):
    """Lấy trạng thái câu hỏi hiện tại của session."""
    story_session = await story_session_manager.get_or_create_session(session_id)
    async with story_session.lock:
        story = _require_story_data(story_session.story_data, session_id)
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
async def story_answer_api(audio: UploadFile = File(...), session_id: str = Form(default="default")):
    """
    Nhận audio câu trả lời của bé, STT, chấm bằng LLM, trả audio phản hồi.
    Sau mỗi câu trả lời, service tự chuyển sang câu hỏi kế tiếp.
    """
    story_session = await story_session_manager.get_or_create_session(session_id)
    audio_bytes = await audio.read()

    already_completed = False
    async with story_session.lock:
        story = _require_story_data(story_session.story_data, session_id)
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

    user_text = await _transcribe_or_bad_request(audio_bytes)

    if not already_completed:
        async with story_session.lock:
            story = _require_story_data(story_session.story_data, session_id)
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
                feedback_text = evaluation["feedback"]
                completed = story_session.completed

    if already_completed:
        reply_text = "Hoàn thành tất cả câu hỏi!"
        path = await synthesize_speech(reply_text, style=UNIFIED_VOICE_STYLE)
        if not path:
            raise HTTPException(500, "TTS thất bại")
        return _story_audio_response(path, {
            "status": "completed",
            "story": story["story"],
            "session_id": session_id,
            "transcript": user_text,
            "text": reply_text,
            "completed": True,
        })

    reply_text = feedback_text
    path = await synthesize_speech(reply_text, style=UNIFIED_VOICE_STYLE)
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
        "next_question_index": story_session.question_index if next_question else None,
        "next_question_id": next_question["id"] if next_question else None,
        "next_question": next_question["question"] if next_question else "",
        "text": feedback_text,
        "feedback_text": feedback_text,
        "next_question_text": next_question_text,
        "completed": completed,
    })


@app.post("/api/story/next-question", tags=["story"])
async def story_next_question_api(session_id: str = "default"):
    """Trả audio câu hỏi hiện tại của session sau khi đã xử lý feedback riêng."""
    story_session = await story_session_manager.get_or_create_session(session_id)

    async with story_session.lock:
        story = _require_story_data(story_session.story_data, session_id)
        if story_session.completed:
            raise HTTPException(409, "Session has already completed")

        question = get_question(story, story_session.question_index)
        if not question:
            story_session.completed = True
            raise HTTPException(404, "Không tìm thấy câu hỏi kế tiếp.")

        question_index = story_session.question_index
        question_text = build_question_text(story, question, question_index)
        total_questions = len(story["questions"])

    path = await synthesize_speech(question_text, style=UNIFIED_VOICE_STYLE)
    if not path:
        raise HTTPException(500, "TTS thất bại")

    return _story_audio_response(path, {
        "status": "asking",
        "story": story["story"],
        "session_id": session_id,
        "question_index": question_index,
        "total_questions": total_questions,
        "question_id": question["id"],
        "question": question["question"],
        "text": question_text,
        "question_text": question_text,
        "completed": False,
        "phase": "listening",
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
        
    path = await synthesize_speech(reply, style=UNIFIED_VOICE_STYLE)
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
