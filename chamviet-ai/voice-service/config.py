import os
from dotenv import load_dotenv

load_dotenv()

# Google API Key (dùng cho Gemini LLM + TTS)
GOOGLE_API_KEY    = os.getenv("GOOGLE_API_KEY", "")

# LLM
LLM_PROVIDER      = os.getenv("LLM_PROVIDER", "gemini").strip().lower()
GEMINI_LLM_MODEL  = os.getenv("GEMINI_LLM_MODEL", "models/gemini-2.5-pro")
GROQ_LLM_MODEL    = os.getenv("GROQ_LLM_MODEL", "llama-3.3-70b-versatile")

# Local semantic similarity
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "dangvantuan/vietnamese-embedding")
EMBEDDING_ACCEPT_THRESHOLD = float(os.getenv("EMBEDDING_ACCEPT_THRESHOLD", "0.7"))
EMBEDDING_REJECT_THRESHOLD = float(os.getenv("EMBEDDING_REJECT_THRESHOLD", "0.3"))

# Gemini (TTS)
TTS_MODEL         = os.getenv("TTS_MODEL", "gemini-2.5-flash-preview-tts")
TTS_VOICE         = os.getenv("TTS_VOICE", "Zephyr")
TTS_LEADING_SILENCE_MS  = int(os.getenv("TTS_LEADING_SILENCE_MS", "350"))
TTS_TRAILING_SILENCE_MS = int(os.getenv("TTS_TRAILING_SILENCE_MS", "450"))
TTS_REQUEST_TIMEOUT_SECONDS = int(os.getenv("TTS_REQUEST_TIMEOUT_SECONDS", "35"))
TTS_TOTAL_TIMEOUT_SECONDS = int(os.getenv("TTS_TOTAL_TIMEOUT_SECONDS", "45"))

# Groq (STT - Whisper)
GROQ_API_KEY      = os.getenv("GROQ_API_KEY", "")
GROQ_STT_MODEL    = os.getenv("GROQ_STT_MODEL", "whisper-large-v3")
STT_RETRY_ORIGINAL_AUDIO = os.getenv("STT_RETRY_ORIGINAL_AUDIO", "true").strip().lower() == "true"
STT_LOW_AVG_LOGPROB_THRESHOLD = float(os.getenv("STT_LOW_AVG_LOGPROB_THRESHOLD", "-1.0"))
STT_HIGH_NO_SPEECH_THRESHOLD = float(os.getenv("STT_HIGH_NO_SPEECH_THRESHOLD", "0.60"))

# Session
MAX_HISTORY_TURNS = int(os.getenv("MAX_HISTORY_TURNS", "20"))
