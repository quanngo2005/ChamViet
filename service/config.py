import os
from dotenv import load_dotenv

load_dotenv()

# ── Groq API ──────────────────────────────────
GROQ_API_KEY  = os.getenv("GROQ_API_KEY", "api")

# ── STT (Groq Whisper) ────────────────────────
WHISPER_MODEL = "whisper-large-v3-turbo"

# ── LLM (Groq Llama) ──────────────────────────
LLM_MODEL     = "openai/gpt-oss-120b"

# ── TTS (Edge TTS - miễn phí, không cần API) ──
TTS_VOICE     = "vi-VN-HoaiMyNeural"  
# ── Audio ─────────────────────────────────────
SAMPLE_RATE   = 16000
