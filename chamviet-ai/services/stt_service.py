from groq import AsyncGroq, Groq
from config import GROQ_API_KEY
import numpy as np
import io, wave

STT_MODEL  = "whisper-large-v3-turbo"
_async_client = None
_client = None


def _get_async_client() -> AsyncGroq:
    global _async_client
    if _async_client is None:
        _async_client = AsyncGroq(api_key=GROQ_API_KEY)
    return _async_client


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def _boost_audio(audio_bytes: bytes) -> bytes:
    """
    Chuẩn hóa âm thanh động (Dynamic Range Normalization).
    Tính toán biên độ tối đa thực tế và scale lên mức tối ưu (85% full scale).
    Có giới hạn gain từ 1.0x đến 8.0x để tránh khuếch đại nhiễu nền khi im lặng.
    """
    buf = io.BytesIO(audio_bytes)
    with wave.open(buf, "rb") as wf:
        params = wf.getparams()
        raw    = wf.readframes(wf.getnframes())

    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    
    # Tính peak amplitude
    peak = np.abs(audio).max()
    if peak > 0:
        target = 27850.0  # ~85% của 32767 (int16 max)
        calculated_gain = target / peak
        # Giới hạn gain thực tế trong khoảng [1.0, 8.0]
        actual_gain = np.clip(calculated_gain, 1.0, 8.0)
        boosted = np.clip(audio * actual_gain, -32768, 32767).astype(np.int16)
    else:
        boosted = audio.astype(np.int16)

    out = io.BytesIO()
    with wave.open(out, "wb") as wf:
        wf.setparams(params)
        wf.writeframes(boosted.tobytes())
    return out.getvalue()


async def transcribe_audio_file(audio_bytes: bytes, language: str = "vi") -> str:
    """
    Nhận audio_bytes (WAV), tự động chuẩn hóa âm lượng động, gửi lên Groq Whisper bất đồng bộ.
    """
    try:
        client = _get_async_client()
        boosted = _boost_audio(audio_bytes)
        result = await client.audio.transcriptions.create(
            model=STT_MODEL,
            file=("audio.wav", boosted),
            language=language,
            response_format="text",
        )
        return result.strip() if result else ""
    except Exception as e:
        print(f"STT async error: {e}")
        return ""


def transcribe_audio_file_sync(audio_bytes: bytes, language: str = "vi") -> str:
    """
    Phiên bản đồng bộ để tương thích ngược nếu cần.
    """
    try:
        client = _get_client()
        boosted = _boost_audio(audio_bytes)
        result = client.audio.transcriptions.create(
            model=STT_MODEL,
            file=("audio.wav", boosted),
            language=language,
            response_format="text",
        )
        return result.strip() if result else ""
    except Exception as e:
        print(f"STT sync error: {e}")
        return ""