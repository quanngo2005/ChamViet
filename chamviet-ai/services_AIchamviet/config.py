import os
from dotenv import load_dotenv

load_dotenv()

# Groq (LLM)
GROQ_API_KEY      = os.getenv("GROQ_API_KEY", "")
GROQ_LLM_MODEL    = os.getenv("GROQ_LLM_MODEL", "llama-3.3-70b-versatile")

# Google (TTS)
GOOGLE_API_KEY    = os.getenv("GOOGLE_API_KEY", "")
TTS_MODEL         = "gemini-2.5-flash-preview-tts"
TTS_VOICE         = os.getenv("TTS_VOICE", "Kore")

# Whisper (STT)
WHISPER_MODEL     = os.getenv("WHISPER_MODEL", "base")

# Session
MAX_HISTORY_TURNS = int(os.getenv("MAX_HISTORY_TURNS", "20"))