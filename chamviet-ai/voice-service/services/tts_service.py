import asyncio
import io
import tempfile
import soundfile as sf
import edge_tts
from config import TTS_VOICE

async def _synthesize_async(text: str, voice: str) -> str:
    """Tạo audio và lưu ra file .wav tạm, trả về path."""
    communicate = edge_tts.Communicate(text, voice)
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]

    # Đọc mp3 bytes → ghi ra file wav tạm
    audio_bytes = io.BytesIO(audio_data)
    data, samplerate = sf.read(audio_bytes)

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        sf.write(f.name, data, samplerate)
        return f.name

def synthesize_speech(text: str, voice: str = TTS_VOICE) -> str:
    """Wrapper đồng bộ cho FastAPI gọi được."""
    return asyncio.run(_synthesize_async(text, voice))
