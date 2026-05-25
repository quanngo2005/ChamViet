import hashlib
import wave
import tempfile
import os
from google import genai
from google.genai import types
from config import GOOGLE_API_KEY, TTS_MODEL, TTS_VOICE

_client = None

# Thiết lập thư mục cache tại thư mục gốc của dự án
CACHE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".cache", "tts"))
os.makedirs(CACHE_DIR, exist_ok=True)


def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GOOGLE_API_KEY)
    return _client


def _get_cache_path(text: str, style: str) -> str:
    # Tạo key băm kết hợp text, phong cách đọc, giọng nói và mô hình để tránh xung đột
    key = f"{text.strip()}||{style.strip()}||{TTS_VOICE}||{TTS_MODEL}"
    hash_val = hashlib.md5(key.encode("utf-8")).hexdigest()
    return os.path.join(CACHE_DIR, f"{hash_val}.wav")


def _save_wave(pcm_data: bytes, output_path: str, sample_rate: int = 24000):
    with wave.open(output_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


# Style mapping: key tiếng Việt → instruction tiếng Anh cho Gemini TTS
STYLE_MAP = {
    "chao"      : "cheerfully and warmly like a friendly kindergarten teacher greeting a child",
    "cau_hoi"   : "slowly and clearly, like a teacher reading a question to a young child",
    "khen"      : "warmly and encouragingly, like praising a child who answered correctly",
    "giai_thich": "gently and patiently, like explaining a story to a young child",
    "dong_vien" : "softly and kindly, like motivating a child who does not know the answer",
    "ket_thuc"  : "softly and warmly, like saying goodbye at the end of a class",
    "nhac_lai"  : "gently and clearly, like reminding a child to try answering again",
    "sai"       : "gently and softly, like a teacher correcting a child without making them feel bad",
}

DEFAULT_TTS_STYLE = "chao"


async def synthesize_speech(text: str) -> str:
    """
    Tổng hợp giọng nói từ text dùng Gemini TTS bất đồng bộ có kèm bộ đệm WAV thông minh.

    Args:
        text:  nội dung cần đọc (tiếng Việt)
        style được cố định bên trong service để tránh bị FE/BE ghi đè

    Returns:
        Đường dẫn file WAV (đã cache hoặc mới tạo), hoặc "" nếu lỗi.
    """
    if not text.strip():
        return ""

    # 1. Kiểm tra cache trước để trả về ngay lập tức (0ms latency!)
    style = DEFAULT_TTS_STYLE
    cache_path = _get_cache_path(text, style)
    if os.path.exists(cache_path):
        return cache_path

    try:
        client = _get_client()

        style_instruction = STYLE_MAP.get(style, "")
        if style_instruction:
            prompt = f"Say {style_instruction}: {text}"
        else:
            prompt = text

        # 2. Gọi API Google GenAI bất đồng bộ
        response = await client.aio.models.generate_content(
            model=TTS_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=TTS_VOICE,
                        )
                    )
                ),
            ),
        )

        audio_data = response.candidates[0].content.parts[0].inline_data.data
        
        # 3. Lưu dữ liệu WAV vào tệp cache
        _save_wave(audio_data, cache_path)
        return cache_path

    except Exception as e:
        print(f"TTS async error: {e}")
        return ""


def synthesize_speech_sync(text: str) -> str:
    """
    Phiên bản đồng bộ để dự phòng hoặc tương thích ngược.
    """
    if not text.strip():
        return ""

    style = DEFAULT_TTS_STYLE
    cache_path = _get_cache_path(text, style)
    if os.path.exists(cache_path):
        return cache_path

    try:
        client = _get_client()

        style_instruction = STYLE_MAP.get(style, "")
        if style_instruction:
            prompt = f"Say {style_instruction}: {text}"
        else:
            prompt = text

        response = client.models.generate_content(
            model=TTS_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=TTS_VOICE,
                        )
                    )
                ),
            ),
        )

        audio_data = response.candidates[0].content.parts[0].inline_data.data
        _save_wave(audio_data, cache_path)
        return cache_path

    except Exception as e:
        print(f"TTS sync error: {e}")
        return ""
