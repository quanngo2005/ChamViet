import os
from dotenv import load_dotenv

load_dotenv()


def _env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def _env_int(name: str, default: int) -> int:
    raw = _env(name, str(default))
    try:
        return int(raw)
    except ValueError:
        return default


def _env_float(name: str, default: float) -> float:
    raw = _env(name, str(default))
    try:
        return float(raw)
    except ValueError:
        return default


def _env_bool(name: str, default: bool) -> bool:
    raw = _env(name, "true" if default else "false").lower()
    return raw in {"1", "true", "yes", "y", "on"}


def _env_list(name: str, default: str) -> list[str]:
    raw = _env(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


# API keys
GOOGLE_API_KEY = _env("GOOGLE_API_KEY")
GROQ_API_KEY = _env("GROQ_API_KEY")
FPT_STT_API_KEY = _env("FPT_STT_API_KEY")

# LLM
LLM_PROVIDER = _env("LLM_PROVIDER", "gemini").lower()
GEMINI_LLM_MODEL = _env("GEMINI_LLM_MODEL", "models/gemini-2.5-flash")
GEMINI_FALLBACK_MODEL = _env("GEMINI_FALLBACK_MODEL", "models/gemini-2.5-pro")
GROQ_LLM_MODEL = _env("GROQ_LLM_MODEL", "llama-3.3-70b-versatile")
LLM_DEFAULT_TEMPERATURE = _env_float("LLM_DEFAULT_TEMPERATURE", 0.7)
LLM_DEFAULT_MAX_TOKENS = _env_int("LLM_DEFAULT_MAX_TOKENS", 512)
LLM_INTENT_TEMPERATURE = _env_float("LLM_INTENT_TEMPERATURE", 0.0)
LLM_INTENT_MAX_TOKENS = _env_int("LLM_INTENT_MAX_TOKENS", 10)
LLM_JUDGE_TEMPERATURE = _env_float("LLM_JUDGE_TEMPERATURE", 0.2)
LLM_JUDGE_MAX_TOKENS = _env_int("LLM_JUDGE_MAX_TOKENS", 80)
LLM_RETRY_ATTEMPTS = _env_int("LLM_RETRY_ATTEMPTS", 3)
LLM_RETRY_BASE_DELAY = _env_float("LLM_RETRY_BASE_DELAY", 1.0)

# Local semantic similarity
EMBEDDING_MODEL_NAME = _env("EMBEDDING_MODEL_NAME", "dangvantuan/vietnamese-embedding")
EMBEDDING_ACCEPT_THRESHOLD = _env_float("EMBEDDING_ACCEPT_THRESHOLD", 0.7)
EMBEDDING_REJECT_THRESHOLD = _env_float("EMBEDDING_REJECT_THRESHOLD", 0.3)

# Gemini TTS
TTS_MODEL = _env("TTS_MODEL", "gemini-2.5-flash-preview-tts")
TTS_VOICE = _env("TTS_VOICE", "Leda") or "Leda"
TTS_FALLBACK_VOICES = _env_list(
    "TTS_FALLBACK_VOICES",
    "Leda,Laomedeia,Aoede,Autonoe,Zephyr",
)
TTS_PROMPT_VERSION = _env("TTS_PROMPT_VERSION", "story-child-girl-v1")
TTS_PERSONA_STYLE = os.getenv(
    "TTS_PERSONA_STYLE",
    (
        "Giọng bé gái Việt Nam khoảng 6 đến 9 tuổi, vui tươi, tinh nghịch, "
        "hồn nhiên và thân thiện. Âm sắc sáng, dễ thương, rõ dấu tiếng Việt. "
        "Nói tự nhiên, không quá chậm, không kể chuyện cổ tích, không trầm buồn, "
        "không nghiêm nghị, không la hét."
    ),
).strip()
TTS_LEADING_SILENCE_MS = _env_int("TTS_LEADING_SILENCE_MS", 120)
TTS_TRAILING_SILENCE_MS = _env_int("TTS_TRAILING_SILENCE_MS", 180)
TTS_REQUEST_TIMEOUT_SECONDS = _env_int("TTS_REQUEST_TIMEOUT_SECONDS", 35)
TTS_TOTAL_TIMEOUT_SECONDS = _env_int("TTS_TOTAL_TIMEOUT_SECONDS", 45)
TTS_RETRY_ATTEMPTS = _env_int("TTS_RETRY_ATTEMPTS", 3)
TTS_RETRY_DELAY_SECONDS = _env_float("TTS_RETRY_DELAY_SECONDS", 2.0)
TTS_OUTPUT_SAMPLE_RATE = _env_int("TTS_OUTPUT_SAMPLE_RATE", 24000)

# STT
STT_PROVIDER = _env("STT_PROVIDER", "groq").lower()
STT_MODEL = _env("STT_MODEL", "whisper-large-v3")
STT_LANGUAGE = _env("STT_LANGUAGE", "vi")
STT_RESPONSE_FORMAT = _env("STT_RESPONSE_FORMAT", "verbose_json")
STT_TEMPERATURE = _env_float("STT_TEMPERATURE", 0.0)
STT_RETRY_ORIGINAL_AUDIO = _env_bool("STT_RETRY_ORIGINAL_AUDIO", True)
STT_LOW_AVG_LOGPROB_THRESHOLD = _env_float("STT_LOW_AVG_LOGPROB_THRESHOLD", -1.0)
STT_HIGH_NO_SPEECH_THRESHOLD = _env_float("STT_HIGH_NO_SPEECH_THRESHOLD", 0.60)

# Audio normalization for STT
STT_SILENCE_RATIO = _env_float("STT_SILENCE_RATIO", 0.02)
STT_MIN_SILENCE_THRESHOLD = _env_float("STT_MIN_SILENCE_THRESHOLD", 300.0)
STT_PADDING_SECONDS = _env_float("STT_PADDING_SECONDS", 0.15)
STT_TARGET_PEAK = _env_float("STT_TARGET_PEAK", 27850.0)
STT_MAX_GAIN = _env_float("STT_MAX_GAIN", 3.5)

# Test pipeline audio
TEST_AUDIO_SAMPLE_RATE = _env_int("TEST_AUDIO_SAMPLE_RATE", 16000)
TEST_AUDIO_CHANNELS = _env_int("TEST_AUDIO_CHANNELS", 1)
TEST_AUDIO_DTYPE = _env("TEST_AUDIO_DTYPE", "int16")
TEST_MIN_AUDIO_SECONDS = _env_float("TEST_MIN_AUDIO_SECONDS", 0.3)

# Session
MAX_HISTORY_TURNS = _env_int("MAX_HISTORY_TURNS", 20)


def get_active_llm_model() -> str:
    return GROQ_LLM_MODEL if LLM_PROVIDER == "groq" else GEMINI_LLM_MODEL
