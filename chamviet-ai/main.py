from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from services.content_service import load_content, build_system_prompt, estimate_token_count
from services.stt_service     import transcribe_audio_file
from services.llm_service     import get_answer, classify_intent
from services.tts_service     import synthesize_speech
from services.session_service import SessionManager, add_turn, clear_history, format_for_display

app = FastAPI(title="CoTich Voice Bot")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo quản lý phiên đa người dùng bất đồng bộ
session_manager = SessionManager()
GLOBAL_SYSTEM_PROMPT = ""


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
# CHAT
# ════════════════════════════════════════════════════════

class ChatInput(BaseModel):
    message: str

@app.post("/api/chat", tags=["chat"])
async def chat_api(body: ChatInput):
    """Gửi text nhận phản hồi dạng text của cô giáo bất đồng bộ."""
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


class ChatSpeakInput(BaseModel):
    message: str
    style  : str = ""

@app.post("/api/chat-speak", tags=["chat"])
async def chat_speak_api(body: ChatSpeakInput):
    """Trò chuyện và trả về âm thanh cô giáo trong cùng 1 request bất đồng bộ."""
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