from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import tempfile, os

from services.content_service  import load_content, build_system_prompt, estimate_token_count
from services.stt_service      import transcribe_audio_file
from services.llm_service      import get_answer
from services.tts_service      import synthesize_speech
from services.session_service  import add_turn, clear_history, format_for_display
from services.matching_service import match_best_answer
from services import conversation_service

app = FastAPI(title="Voice AI Bot")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

store = {"system_prompt": "", "history": []}


# ════════════════════════════════════════════════════════
# HELPERS
# ════════════════════════════════════════════════════════

def _check():
    if not store["system_prompt"]:
        raise HTTPException(400, "Chưa load nội dung. Gọi /api/load-content trước.")

def _llm(prompt: str) -> str:
    """Gọi LLM + lưu history — dùng cho luồng hội thoại chính."""
    ans = get_answer(prompt, store["system_prompt"], store["history"])
    store["history"] = add_turn(store["history"], prompt, ans)
    return ans

def _llm_pure(prompt: str) -> str:
    """Gọi LLM KHÔNG lưu history — classify, explain, ending..."""
    return get_answer(prompt, store["system_prompt"], [])


# ════════════════════════════════════════════════════════
# SYSTEM
# ════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {"status": "ok", "message": "Server is running!"}


class ContentInput(BaseModel):
    content: str

@app.post("/api/load-content")
def load_content_api(body: ContentInput):
    content = load_content(body.content)
    store["system_prompt"] = build_system_prompt(content)
    store["history"]       = clear_history()
    return {
        "status"        : "ok",
        "chars"         : len(content),
        "token_estimate": estimate_token_count(content),
    }


@app.post("/api/transcribe")
async def transcribe_api(audio: UploadFile = File(...)):
    ext = os.path.splitext(audio.filename)[-1] or ".wav"
    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as f:
        f.write(await audio.read())
        tmp = f.name
    try:
        return {"text": transcribe_audio_file(tmp)}
    finally:
        os.remove(tmp)


class TTSInput(BaseModel):
    text: str

@app.post("/api/speak")
def speak_api(body: TTSInput):
    return FileResponse(synthesize_speech(body.text),
                        media_type="audio/wav", filename="reply.wav")


@app.get("/api/history")
def get_history():
    return {"history": format_for_display(store["history"])}


@app.post("/api/reset")
def reset_api():
    store["history"]       = clear_history()
    store["system_prompt"] = ""
    return {"status": "cleared"}


# ════════════════════════════════════════════════════════
# CONVERSATION — dùng chung mọi câu chuyện
# ════════════════════════════════════════════════════════

class StoryBase(BaseModel):
    story_title: str
    child_age  : int = 6

@app.post("/api/greeting")
def greeting_api(body: StoryBase):
    _check()
    return {"text": _llm(conversation_service.build_greeting_prompt(
        body.story_title, body.child_age))}


# ── Đọc câu hỏi (tự luận — không có options) ──
class ReadQuestionInput(BaseModel):
    story_title: str
    child_age  : int = 6
    question   : str

@app.post("/api/read-question")
def read_question_api(body: ReadQuestionInput):
    _check()
    return {"text": _llm(conversation_service.build_read_question_prompt(
        body.story_title, body.child_age, body.question))}


# ── Classify intent ──
class ClassifyInput(BaseModel):
    current_question: str
    user_text       : str

@app.post("/api/classify")
def classify_api(body: ClassifyInput):
    _check()
    result = _llm_pure(conversation_service.classify_intent_prompt(
        body.current_question, body.user_text))
    return {"intent": result.strip().upper()}


# ── Cosine match (tự luận — so user_text vs correct_answer) ──
class MatchInput(BaseModel):
    user_text     : str
    correct_answer: str

@app.post("/api/match")
def match_api(body: MatchInput):
    # Dùng options={"A": correct_answer}, threshold=0.0 để lấy score thô
    _, score = match_best_answer(body.user_text, {"A": body.correct_answer}, threshold=0.0)
    return {"score": round(score, 4)}


# ── Trả lời đúng ──
class CorrectInput(BaseModel):
    story_title   : str
    child_age     : int = 6
    question      : str
    child_answer  : str
    correct_answer: str

@app.post("/api/correct")
def correct_api(body: CorrectInput):
    _check()
    return {"text": _llm(conversation_service.build_correct_prompt(
        body.story_title, body.child_age,
        body.question, body.child_answer, body.correct_answer))}


# ── Trả lời sai ──
class WrongInput(BaseModel):
    story_title   : str
    child_age     : int = 6
    question      : str
    child_answer  : str
    correct_answer: str

@app.post("/api/wrong")
def wrong_api(body: WrongInput):
    _check()
    return {"text": _llm(conversation_service.build_wrong_prompt(
        body.story_title, body.child_age,
        body.question, body.child_answer, body.correct_answer))}


# ── Trả lời không rõ ──
class UnclearInput(BaseModel):
    story_title: str
    child_age  : int = 6
    question   : str

@app.post("/api/unclear")
def unclear_api(body: UnclearInput):
    _check()
    return {"text": _llm_pure(conversation_service.build_unclear_prompt(
        body.story_title, body.child_age, body.question))}


# ── Bé không biết ──
class ConfusedInput(BaseModel):
    story_title   : str
    child_age     : int = 6
    question      : str
    correct_answer: str

@app.post("/api/confused")
def confused_api(body: ConfusedInput):
    _check()
    return {"text": _llm(conversation_service.build_confused_prompt(
        body.story_title, body.child_age,
        body.question, body.correct_answer))}


# ── Giải thích nội dung câu chuyện ──
class ExplainInput(BaseModel):
    story_title   : str
    child_age     : int = 6
    child_question: str

@app.post("/api/explain")
def explain_api(body: ExplainInput):
    _check()
    return {"text": _llm_pure(conversation_service.build_explain_prompt(
        body.story_title, body.child_age, body.child_question))}


# ── Sau giải thích → nhắc bé trả lời lại ──
class AfterExplainInput(BaseModel):
    child_age        : int = 6
    original_question: str

@app.post("/api/after-explain")
def after_explain_api(body: AfterExplainInput):
    _check()
    return {"text": _llm_pure(conversation_service.build_after_explain_prompt(
        body.child_age, body.original_question))}


# ── Kết thúc buổi học ──
class EndingInput(BaseModel):
    story_title: str
    child_age  : int = 6
    score      : int
    total      : int

@app.post("/api/ending")
def ending_api(body: EndingInput):
    _check()
    return {"text": _llm_pure(conversation_service.build_ending_prompt(
        body.story_title, body.child_age, body.score, body.total))}
