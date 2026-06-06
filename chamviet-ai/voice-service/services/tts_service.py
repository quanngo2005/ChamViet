import asyncio
import hashlib
import os
import tempfile
import time
import wave

from google import genai
from google.genai import types

from config import (
    GOOGLE_API_KEY,
    TTS_LEADING_SILENCE_MS,
    TTS_MODEL,
    TTS_REQUEST_TIMEOUT_SECONDS,
    TTS_TRAILING_SILENCE_MS,
    TTS_TOTAL_TIMEOUT_SECONDS,
    TTS_VOICE,
)

_client = None

CACHE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".cache", "tts"))
os.makedirs(CACHE_DIR, exist_ok=True)

TTS_RETRY_ATTEMPTS = 3
TTS_RETRY_DELAY_SECONDS = 2
TTS_FALLBACK_VOICES = ["Sulafat", "Achird", "Vindemiatrix", "Zephyr", "Kore"]
TTS_PROMPT_VERSION = "story-teacher-unified-v3"
UNIFIED_STORY_STYLE = (
    "Mot giong duy nhat: co giao ke chuyen co tich am ap, cham rai, diu dang, "
    "ro rang va gan gui. Khong tao bat ky khac biet nao giua luc doc cau hoi "
    "va luc doc cau tra loi/phai hoi. Giu cung toc do, cung muc nang luong, "
    "cung do am va cung cach ngat nghi."
)

STYLE_MAP = {
    "chao": UNIFIED_STORY_STYLE,
    "cau_hoi": UNIFIED_STORY_STYLE,
    "khen": UNIFIED_STORY_STYLE,
    "giai_thich": UNIFIED_STORY_STYLE,
    "dong_vien": UNIFIED_STORY_STYLE,
    "ket_thuc": UNIFIED_STORY_STYLE,
    "nhac_lai": UNIFIED_STORY_STYLE,
    "sai": UNIFIED_STORY_STYLE,
}


def _get_client():
    global _client
    if not GOOGLE_API_KEY:
        raise ValueError("Thieu GOOGLE_API_KEY trong file .env hoac cau hinh!")
    if _client is None:
        _client = genai.Client(api_key=GOOGLE_API_KEY)
    return _client


def _voice_candidates() -> list[str]:
    voices = [TTS_VOICE, *TTS_FALLBACK_VOICES]
    return list(dict.fromkeys([voice for voice in voices if voice]))


def _normalize_style(style: str) -> str:
    return "story_teacher" if style in STYLE_MAP else style.strip()


def _get_cache_path(text: str, style: str) -> str:
    style_key = _normalize_style(style)
    key = f"{TTS_PROMPT_VERSION}||{text.strip()}||{style_key}||{TTS_VOICE}||{TTS_MODEL}"
    hash_val = hashlib.md5(key.encode("utf-8")).hexdigest()
    return os.path.join(CACHE_DIR, f"{hash_val}.wav")


def _silence_bytes(sample_rate: int, duration_ms: int, channels: int = 1, sampwidth: int = 2) -> bytes:
    frame_count = max(0, int(sample_rate * duration_ms / 1000))
    return b"\x00" * frame_count * channels * sampwidth


def _save_wave(pcm_data: bytes, output_path: str, sample_rate: int = 24000):
    fd, tmp_path = tempfile.mkstemp(suffix=".wav", dir=CACHE_DIR)
    os.close(fd)
    try:
        padded_pcm = (
            _silence_bytes(sample_rate, TTS_LEADING_SILENCE_MS)
            + pcm_data
            + _silence_bytes(sample_rate, TTS_TRAILING_SILENCE_MS)
        )
        with wave.open(tmp_path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            wf.writeframes(padded_pcm)
        os.replace(tmp_path, output_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def _build_prompt(text: str, style: str = "") -> str:
    base_instruction = (
        "Doc hoan toan bang tieng Viet Nam. Phat am ro dau thanh va ro tung tu, "
        "khong nuot chu, khong bo bat ky tu nao o dau cau hoac cuoi cau, "
        "khong doc bang giong Anh-Viet. Truoc khi bat dau noi hay nghi mot nhip rat ngan; "
        "sau khi doc xong toan bo van ban hay giu mot nhip im lang rat ngan. "
        f"{UNIFIED_STORY_STYLE} "
        "Neu van ban la cau hoi hay cau nhan xet, van phai doc bang chinh xac cung mot giong; "
        "chi ngu dieu len xuong theo dau cau mot cach tu nhien, khong doi tone."
    )

    return (
        f"{base_instruction}\n\n"
        "Chi doc noi dung trong muc VAN BAN. Khong doc phan huong dan. "
        "Doc day du tu dau tien den tu cuoi cung trong VAN BAN.\n"
        f"VAN BAN:\n{text.strip()}\n"
        "HET VAN BAN."
    )


def _extract_audio_data(response) -> bytes:
    try:
        return response.candidates[0].content.parts[0].inline_data.data
    except (AttributeError, IndexError, TypeError) as e:
        raise RuntimeError("Gemini TTS khong tra ve du lieu audio hop le") from e


async def _request_tts_async(client, prompt: str, voice_name: str) -> bytes:
    response = await asyncio.wait_for(
        client.aio.models.generate_content(
            model=TTS_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice_name,
                        )
                    )
                ),
            ),
        ),
        timeout=TTS_REQUEST_TIMEOUT_SECONDS,
    )
    return _extract_audio_data(response)


def _request_tts_sync(client, prompt: str, voice_name: str) -> bytes:
    response = client.models.generate_content(
        model=TTS_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=voice_name,
                    )
                )
            ),
        ),
    )
    return _extract_audio_data(response)


async def _generate_tts_async(client, prompt: str) -> bytes:
    last_error = None
    for voice_name in _voice_candidates():
        for attempt in range(1, TTS_RETRY_ATTEMPTS + 1):
            try:
                return await _request_tts_async(client, prompt, voice_name)
            except Exception as e:
                last_error = e
                print(
                    f"TTS async error voice='{voice_name}' "
                    f"attempt={attempt}/{TTS_RETRY_ATTEMPTS}: {e}"
                )
                if attempt < TTS_RETRY_ATTEMPTS:
                    await asyncio.sleep(TTS_RETRY_DELAY_SECONDS * attempt)
    raise RuntimeError("Khong the tao audio TTS sau khi retry") from last_error


def _generate_tts_sync(client, prompt: str) -> bytes:
    last_error = None
    for voice_name in _voice_candidates():
        for attempt in range(1, TTS_RETRY_ATTEMPTS + 1):
            try:
                return _request_tts_sync(client, prompt, voice_name)
            except Exception as e:
                last_error = e
                print(
                    f"TTS sync error voice='{voice_name}' "
                    f"attempt={attempt}/{TTS_RETRY_ATTEMPTS}: {e}"
                )
                if attempt < TTS_RETRY_ATTEMPTS:
                    time.sleep(TTS_RETRY_DELAY_SECONDS * attempt)
    raise RuntimeError("Khong the tao audio TTS sau khi retry") from last_error


async def synthesize_speech(text: str, style: str = "") -> str:
    if not text.strip():
        return ""

    cache_path = _get_cache_path(text, style)
    if os.path.exists(cache_path):
        return cache_path

    try:
        client = _get_client()
        prompt = _build_prompt(text, style)
        print(f"[TTS] Synthesizing style='{style}' chars={len(text)} text='{text[:80]}'", flush=True)
        audio_data = await asyncio.wait_for(
            _generate_tts_async(client, prompt),
            timeout=TTS_TOTAL_TIMEOUT_SECONDS,
        )
        _save_wave(audio_data, cache_path)
        return cache_path
    except Exception as e:
        print(f"TTS async failed: {e}")
        return ""


def synthesize_speech_sync(text: str, style: str = "") -> str:
    if not text.strip():
        return ""

    cache_path = _get_cache_path(text, style)
    if os.path.exists(cache_path):
        return cache_path

    try:
        client = _get_client()
        prompt = _build_prompt(text, style)
        audio_data = _generate_tts_sync(client, prompt)
        _save_wave(audio_data, cache_path)
        return cache_path
    except Exception as e:
        print(f"TTS sync failed: {e}")
        return ""
