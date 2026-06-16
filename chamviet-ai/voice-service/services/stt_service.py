import io
import wave
import asyncio
import numpy as np
from groq import AsyncGroq, Groq
from config import (
    GROQ_API_KEY,
    STT_HIGH_NO_SPEECH_THRESHOLD,
    STT_LANGUAGE,
    STT_LOW_AVG_LOGPROB_THRESHOLD,
    STT_MAX_GAIN,
    STT_MIN_SILENCE_THRESHOLD,
    STT_MODEL,
    STT_PADDING_SECONDS,
    STT_PROVIDER,
    STT_RESPONSE_FORMAT,
    STT_RETRY_ORIGINAL_AUDIO,
    STT_SILENCE_RATIO,
    STT_TARGET_PEAK,
    STT_TEMPERATURE,
)

_async_client = None
_client = None


def _ensure_supported_provider():
    if STT_PROVIDER != "groq":
        raise ValueError(f"STT_PROVIDER='{STT_PROVIDER}' chua duoc ho tro trong service hien tai")


def _get_async_client() -> AsyncGroq:
    global _async_client
    _ensure_supported_provider()
    if _async_client is None:
        _async_client = AsyncGroq(api_key=GROQ_API_KEY)
    return _async_client


def _get_client() -> Groq:
    global _client
    _ensure_supported_provider()
    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def _boost_audio(audio_bytes: bytes) -> bytes:
    """
    Chuẩn hóa âm thanh chung trước khi gửi STT.
    Hỗ trợ WAV mono/stereo, trim im lặng nhẹ ở đầu/cuối và chuẩn hóa biên độ động.
    """
    buf = io.BytesIO(audio_bytes)
    try:
        with wave.open(buf, "rb") as wf:
            params = wf.getparams()
            channels = wf.getnchannels()
            sample_width = wf.getsampwidth()
            raw = wf.readframes(wf.getnframes())
    except wave.Error:
        return audio_bytes

    if sample_width != 2:
        return audio_bytes

    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    if channels > 1:
        audio = audio.reshape(-1, channels).mean(axis=1)

    if audio.size == 0:
        return audio_bytes

    # Trim im lặng rất nhẹ để bộ nhận diện tập trung vào phần bé nói.
    abs_audio = np.abs(audio)
    peak = abs_audio.max()
    if peak > 0:
        silence_threshold = max(peak * STT_SILENCE_RATIO, STT_MIN_SILENCE_THRESHOLD)
        speech_indexes = np.where(abs_audio > silence_threshold)[0]
        if speech_indexes.size:
            padding = int(params.framerate * STT_PADDING_SECONDS)
            start = max(int(speech_indexes[0]) - padding, 0)
            end = min(int(speech_indexes[-1]) + padding, audio.size - 1)
            audio = audio[start:end + 1]

    peak = np.abs(audio).max()
    if peak > 0:
        target = STT_TARGET_PEAK
        calculated_gain = target / peak
        actual_gain = np.clip(calculated_gain, 1.0, STT_MAX_GAIN)
        boosted = np.clip(audio * actual_gain, -32768, 32767).astype(np.int16)
    else:
        boosted = audio.astype(np.int16)

    out = io.BytesIO()
    with wave.open(out, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(params.framerate)
        wf.writeframes(boosted.tobytes())
    return out.getvalue()


def _extract_text(result) -> str:
    if result is None:
        return ""
    if isinstance(result, str):
        return result.strip()
    text = getattr(result, "text", "")
    if text:
        return str(text).strip()
    if isinstance(result, dict):
        return str(result.get("text") or "").strip()
    return ""


def _extract_stt_stats(result) -> dict:
    segments = getattr(result, "segments", None)
    if segments is None and isinstance(result, dict):
        segments = result.get("segments")
    if not segments:
        return {"avg_logprob": None, "no_speech_prob": None}

    avg_values = []
    no_speech_values = []
    for segment in segments:
        if isinstance(segment, dict):
            avg = segment.get("avg_logprob")
            no_speech = segment.get("no_speech_prob")
        else:
            avg = getattr(segment, "avg_logprob", None)
            no_speech = getattr(segment, "no_speech_prob", None)
        if avg is not None:
            avg_values.append(float(avg))
        if no_speech is not None:
            no_speech_values.append(float(no_speech))

    return {
        "avg_logprob": sum(avg_values) / len(avg_values) if avg_values else None,
        "no_speech_prob": max(no_speech_values) if no_speech_values else None,
    }


def _is_low_confidence(text: str, stats: dict) -> bool:
    if not text:
        return True
    avg_logprob = stats.get("avg_logprob")
    no_speech_prob = stats.get("no_speech_prob")
    if avg_logprob is not None and avg_logprob < STT_LOW_AVG_LOGPROB_THRESHOLD:
        return True
    if no_speech_prob is not None and no_speech_prob > STT_HIGH_NO_SPEECH_THRESHOLD:
        return True
    return False


def _choose_better_transcript(first: tuple[str, dict], second: tuple[str, dict]) -> str:
    first_text, first_stats = first
    second_text, second_stats = second
    first_low = _is_low_confidence(first_text, first_stats)
    second_low = _is_low_confidence(second_text, second_stats)

    if first_low and not second_low:
        return second_text
    if second_low and not first_low:
        return first_text
    if len(second_text.split()) > len(first_text.split()) + 1:
        return second_text
    return first_text or second_text


async def _transcribe_once_async(client: AsyncGroq, audio_bytes: bytes, language: str) -> tuple[str, dict]:
    result = await client.audio.transcriptions.create(
        model=STT_MODEL,
        file=("audio.wav", audio_bytes),
        language=language,
        response_format=STT_RESPONSE_FORMAT,
        temperature=STT_TEMPERATURE,
    )
    return _extract_text(result), _extract_stt_stats(result)


def _transcribe_once_sync(client: Groq, audio_bytes: bytes, language: str) -> tuple[str, dict]:
    result = client.audio.transcriptions.create(
        model=STT_MODEL,
        file=("audio.wav", audio_bytes),
        language=language,
        response_format=STT_RESPONSE_FORMAT,
        temperature=STT_TEMPERATURE,
    )
    return _extract_text(result), _extract_stt_stats(result)


async def transcribe_audio_file(audio_bytes: bytes, language: str = STT_LANGUAGE) -> str:
    """
    Nhận dạng giọng nói bất đồng bộ bằng Groq Whisper.
    """
    try:
        boosted = _boost_audio(audio_bytes)
        client = _get_async_client()
        first = await _transcribe_once_async(client, boosted, language)
        if STT_RETRY_ORIGINAL_AUDIO and boosted != audio_bytes and _is_low_confidence(*first):
            print(f"[STT Groq] Low confidence after normalization, retrying original audio. text='{first[0]}'", flush=True)
            second = await _transcribe_once_async(client, audio_bytes, language)
            chosen = _choose_better_transcript(first, second)
            return chosen
        return first[0]
    except Exception as e:
        print(f"STT async error: {e}")
        return ""


def transcribe_audio_file_sync(audio_bytes: bytes, language: str = STT_LANGUAGE) -> str:
    """
    Nhận dạng giọng nói đồng bộ bằng Groq Whisper.
    """
    try:
        boosted = _boost_audio(audio_bytes)
        client = _get_client()
        first = _transcribe_once_sync(client, boosted, language)
        if STT_RETRY_ORIGINAL_AUDIO and boosted != audio_bytes and _is_low_confidence(*first):
            print(f"[STT Groq Sync] Low confidence after normalization, retrying original audio. text='{first[0]}'", flush=True)
            second = _transcribe_once_sync(client, audio_bytes, language)
            chosen = _choose_better_transcript(first, second)
            return chosen
        return first[0]
    except Exception as e:
        print(f"STT sync error: {e}")
        return ""
