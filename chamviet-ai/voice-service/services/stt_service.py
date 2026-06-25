import io
import re
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
    STT_VAD_ENERGY_THRESHOLD,
    STT_VAD_SPEECH_MIN_DURATION,
    STT_VAD_SPEECH_RATIO,
)

_async_client = None
_client = None

# ── Common Whisper hallucination patterns (Vietnamese + multilingual) ──
# These are phrases Whisper commonly generates on silence or background noise.
_HALLUCINATION_PATTERNS: list[re.Pattern] = [
    re.compile(r"^(cảm ơn|cam on).*?(xem|theo dõi|đã xem|subscribe)", re.IGNORECASE),
    re.compile(r"^(hẹn gặp lại|hen gap lai)", re.IGNORECASE),
    re.compile(r"^(nhớ (like|subscribe|đăng ký))", re.IGNORECASE),
    re.compile(r"^(đăng ký kênh|dang ky kenh)", re.IGNORECASE),
    re.compile(r"^(thank you|thanks for watching)", re.IGNORECASE),
    re.compile(r"^(please subscribe)", re.IGNORECASE),
    re.compile(r"^(music|♪|🎵|\.{3,}|\*{3,})\s*$", re.IGNORECASE),
    re.compile(r"^(Tạm biệt|Bye bye|Goodbye)\s*[.!]*$", re.IGNORECASE),
    re.compile(r"^\.+$"),  # Just dots
    re.compile(r"^\s*$"),  # Whitespace only
]

# Patterns for repetitive hallucination: same short word/phrase repeated many times
_REPETITION_PATTERN = re.compile(r"^(.{1,15}?)\1{3,}$", re.IGNORECASE | re.DOTALL)


class AudioInputError(Exception):
    """Base class for audio input problems that callers can return as 400s."""


class AudioTooShortError(AudioInputError):
    pass


class AudioDecodingError(AudioInputError):
    pass


class NoSpeechDetectedError(AudioInputError):
    pass


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


# ════════════════════════════════════════════════════════
# VAD – Voice Activity Detection (pre-API silence check)
# ════════════════════════════════════════════════════════

def _read_wav_samples(audio_bytes: bytes) -> tuple[np.ndarray, int] | None:
    """Read WAV bytes into float32 mono samples and sample rate."""
    try:
        with wave.open(io.BytesIO(audio_bytes), "rb") as wf:
            channels = wf.getnchannels()
            sample_width = wf.getsampwidth()
            framerate = wf.getframerate()
            raw = wf.readframes(wf.getnframes())
    except wave.Error:
        return None

    if sample_width != 2:
        return None

    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    if channels > 1:
        audio = audio.reshape(-1, channels).mean(axis=1)

    return audio, framerate


def _is_silence(audio_bytes: bytes) -> bool:
    """
    Energy-based VAD check. Returns True if audio contains no meaningful speech.

    Checks:
    1. Overall RMS energy below threshold → silence
    2. Ratio of "speech frames" (above energy threshold) too low → silence
    3. Total speech duration too short → silence
    """
    result = _read_wav_samples(audio_bytes)
    if result is None:
        return False  # Can't parse → let API handle it

    audio, framerate = result
    if audio.size == 0:
        return True

    # Overall RMS check
    rms = np.sqrt(np.mean(audio ** 2))
    if rms < STT_VAD_ENERGY_THRESHOLD:
        print(f"[VAD] Silence detected: RMS={rms:.1f} < threshold={STT_VAD_ENERGY_THRESHOLD}", flush=True)
        return True

    # Frame-level speech ratio check
    # Use 20ms frames
    frame_size = int(framerate * 0.02)
    if frame_size == 0:
        return False

    num_frames = len(audio) // frame_size
    if num_frames == 0:
        return True

    speech_frames = 0
    for i in range(num_frames):
        frame = audio[i * frame_size : (i + 1) * frame_size]
        frame_rms = np.sqrt(np.mean(frame ** 2))
        if frame_rms > STT_VAD_ENERGY_THRESHOLD:
            speech_frames += 1

    speech_ratio = speech_frames / num_frames
    speech_duration = speech_frames * 0.02  # each frame is 20ms

    if speech_ratio < STT_VAD_SPEECH_RATIO:
        print(f"[VAD] Silence detected: speech_ratio={speech_ratio:.3f} < {STT_VAD_SPEECH_RATIO}", flush=True)
        return True

    if speech_duration < STT_VAD_SPEECH_MIN_DURATION:
        print(f"[VAD] Silence detected: speech_duration={speech_duration:.3f}s < {STT_VAD_SPEECH_MIN_DURATION}s", flush=True)
        return True

    return False


# ════════════════════════════════════════════════════════
# Hallucination detection (post-API check)
# ════════════════════════════════════════════════════════

def _is_hallucination(text: str) -> bool:
    """Check if transcribed text matches known Whisper hallucination patterns."""
    if not text:
        return False

    cleaned = text.strip()
    if not cleaned:
        return True

    # Check against known hallucination phrases
    for pattern in _HALLUCINATION_PATTERNS:
        if pattern.search(cleaned):
            print(f"[STT] Hallucination filtered: '{cleaned}'", flush=True)
            return True

    # Check for repetitive patterns (e.g., "Tôi Tôi Tôi Tôi")
    no_space = cleaned.replace(" ", "")
    if _REPETITION_PATTERN.match(no_space):
        print(f"[STT] Repetitive hallucination filtered: '{cleaned}'", flush=True)
        return True

    return False


# ════════════════════════════════════════════════════════
# Audio preprocessing
# ════════════════════════════════════════════════════════

def _boost_audio(audio_bytes: bytes) -> bytes:
    """
    Chuẩn hóa âm thanh chung trước khi gửi STT.
    Hỗ trợ WAV mono/stereo, trim im lặng nhẹ ở đầu/cuối và chuẩn hóa biên độ động.
    """
    buf = io.BytesIO(audio_bytes)
    try:
        with wave.open(io.BytesIO(audio_bytes), "rb") as wf:
            params = wf.getparams()
            channels = wf.getnchannels()
            sample_width = wf.getsampwidth()
            raw = wf.readframes(wf.getnframes())
    except (EOFError, wave.Error) as exc:
        raise AudioDecodingError("Không giải mã được file âm thanh WAV.") from exc

    if sample_width != 2:
        raise AudioDecodingError("Codec WAV không được hỗ trợ. Cần PCM 16-bit.")
    if channels not in (1, 2):
        raise AudioDecodingError("Số kênh âm thanh không được hỗ trợ. Cần mono hoặc stereo.")
    if not raw:
        raise NoSpeechDetectedError("Không nghe thấy giọng nói trong bản ghi.")

    return params, channels, raw


def _boost_audio(audio_bytes: bytes) -> bytes:
    """
    Chuẩn hóa âm thanh chung trước khi gửi STT.
    Hỗ trợ WAV mono/stereo, trim im lặng nhẹ ở đầu/cuối và chuẩn hóa biên độ động.
    """
    params, channels, raw = _read_supported_wav(audio_bytes)

    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    if channels > 1:
        audio = audio.reshape(-1, channels).mean(axis=1)

    if audio.size == 0:
        raise NoSpeechDetectedError("Không nghe thấy giọng nói trong bản ghi.")

    # Trim im lặng rất nhẹ để bộ nhận diện tập trung vào phần bé nói.
    abs_audio = np.abs(audio)
    peak = abs_audio.max()
    if peak < STT_MIN_SILENCE_THRESHOLD:
        raise NoSpeechDetectedError("Không nghe thấy giọng nói trong bản ghi.")
    if peak > 0:
        silence_threshold = max(peak * STT_SILENCE_RATIO, STT_MIN_SILENCE_THRESHOLD)
        speech_indexes = np.where(abs_audio > silence_threshold)[0]
        if not speech_indexes.size:
            raise NoSpeechDetectedError("Không nghe thấy giọng nói trong bản ghi.")

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


# ════════════════════════════════════════════════════════
# Result extraction & confidence checks
# ════════════════════════════════════════════════════════

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


def _should_reject_transcript(text: str, stats: dict) -> bool:
    """
    Final gate: reject if no_speech_prob is very high (silence)
    OR if text matches hallucination patterns.
    """
    if not text:
        return True

    no_speech_prob = stats.get("no_speech_prob")
    if no_speech_prob is not None and no_speech_prob > STT_HIGH_NO_SPEECH_THRESHOLD:
        print(f"[STT] Rejected (no_speech_prob={no_speech_prob:.3f}): '{text}'", flush=True)
        return True

    if _is_hallucination(text):
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


# ════════════════════════════════════════════════════════
# Transcription calls
# ════════════════════════════════════════════════════════

async def _transcribe_once_async(client: AsyncGroq, audio_bytes: bytes, language: str) -> tuple[str, dict]:
    result = await asyncio.wait_for(
        client.audio.transcriptions.create(
            model=STT_MODEL,
            file=("audio.wav", audio_bytes),
            language=language,
            response_format=STT_RESPONSE_FORMAT,
            temperature=STT_TEMPERATURE,
        ),
        timeout=15.0,
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


def _get_audio_duration(audio_bytes: bytes) -> float:
    params, _channels, raw = _read_supported_wav(audio_bytes)
    sample_count = len(raw) / max(params.sampwidth * params.nchannels, 1)
    return sample_count / max(params.framerate, 1)


# ════════════════════════════════════════════════════════
# Public API
# ════════════════════════════════════════════════════════

async def transcribe_audio_file(audio_bytes: bytes, language: str = STT_LANGUAGE) -> str:
    """
    Nhận dạng giọng nói bất đồng bộ bằng Groq Whisper.
    Bao gồm VAD pre-check và hallucination post-filter.
    """
    if _get_audio_duration(audio_bytes) < 0.3:
        raise AudioTooShortError("Âm thanh quá ngắn, hãy nói lại nhé.")

    # ── VAD pre-check: reject silence before API call ──
    if _is_silence(audio_bytes):
        return ""

    try:
        boosted = _boost_audio(audio_bytes)

        # Check boosted audio for silence too (after trim)
        if _is_silence(boosted):
            return ""

        client = _get_async_client()
        first = await _transcribe_once_async(client, boosted, language)

        # ── Post-API rejection: high no_speech_prob or hallucination ──
        if _should_reject_transcript(first[0], first[1]):
            if STT_RETRY_ORIGINAL_AUDIO and boosted != audio_bytes:
                print(f"[STT Groq] Rejected after normalization, retrying original audio.", flush=True)
                second = await _transcribe_once_async(client, audio_bytes, language)
                if _should_reject_transcript(second[0], second[1]):
                    print(f"[STT Groq] Rejected original audio too. Returning empty.", flush=True)
                    return ""
                return second[0]
            return ""

        if STT_RETRY_ORIGINAL_AUDIO and boosted != audio_bytes and _is_low_confidence(*first):
            print(f"[STT Groq] Low confidence after normalization, retrying original audio. text='{first[0]}'", flush=True)
            second = await _transcribe_once_async(client, audio_bytes, language)
            if _should_reject_transcript(second[0], second[1]):
                # Second attempt rejected, use first if it wasn't rejected
                return first[0]
            chosen = _choose_better_transcript(first, second)
            if not chosen:
                raise NoSpeechDetectedError("Không nhận diện được giọng nói trong bản ghi.")
            return chosen

        return first[0]
    except AudioInputError:
        raise
    except Exception as e:
        print(f"STT async error: {e}")
        raise


def transcribe_audio_file_sync(audio_bytes: bytes, language: str = STT_LANGUAGE) -> str:
    """
    Nhận dạng giọng nói đồng bộ bằng Groq Whisper.
    Bao gồm VAD pre-check và hallucination post-filter.
    """
    if _get_audio_duration(audio_bytes) < 0.3:
        return ""

    # ── VAD pre-check: reject silence before API call ──
    if _is_silence(audio_bytes):
        return ""

    try:
        boosted = _boost_audio(audio_bytes)

        # Check boosted audio for silence too (after trim)
        if _is_silence(boosted):
            return ""

        client = _get_client()
        first = _transcribe_once_sync(client, boosted, language)

        # ── Post-API rejection: high no_speech_prob or hallucination ──
        if _should_reject_transcript(first[0], first[1]):
            if STT_RETRY_ORIGINAL_AUDIO and boosted != audio_bytes:
                print(f"[STT Groq Sync] Rejected after normalization, retrying original audio.", flush=True)
                second = _transcribe_once_sync(client, audio_bytes, language)
                if _should_reject_transcript(second[0], second[1]):
                    print(f"[STT Groq Sync] Rejected original audio too. Returning empty.", flush=True)
                    return ""
                return second[0]
            return ""

        if STT_RETRY_ORIGINAL_AUDIO and boosted != audio_bytes and _is_low_confidence(*first):
            print(f"[STT Groq Sync] Low confidence after normalization, retrying original audio. text='{first[0]}'", flush=True)
            second = _transcribe_once_sync(client, audio_bytes, language)
            if _should_reject_transcript(second[0], second[1]):
                return first[0]
            chosen = _choose_better_transcript(first, second)
            if not chosen:
                raise NoSpeechDetectedError("Không nhận diện được giọng nói trong bản ghi.")
            return chosen

        return first[0]
    except AudioInputError:
        raise
    except Exception as e:
        print(f"STT sync error: {e}")
        return ""
