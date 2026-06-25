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
    TTS_PERSONA_STYLE,
    TTS_PROMPT_VERSION,
    TTS_REQUEST_TIMEOUT_SECONDS,
    TTS_RETRY_ATTEMPTS,
    TTS_RETRY_DELAY_SECONDS,
    TTS_OUTPUT_SAMPLE_RATE,
    TTS_TRAILING_SILENCE_MS,
    TTS_TOTAL_TIMEOUT_SECONDS,
    TTS_VOICE,
)

_client = None
UNIFIED_VOICE_STYLE = "single_northern_child_voice"
LOCAL_TTS_PROMPT_VERSION = f"{TTS_PROMPT_VERSION}|single-northern-child-voice-full-v5"

CACHE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".cache", "tts"))
os.makedirs(CACHE_DIR, exist_ok=True)

UNIFIED_STORY_STYLE = (
    f"{TTS_PERSONA_STYLE} "
    "Đây là chất giọng duy nhất cho mọi loại câu: đọc câu hỏi, trả lời người dùng, khen, giải thích, động viên và feedback. "
    "Luôn giữ âm sắc bé gái 6 đến 9 tuổi, hồn nhiên, sáng, phát âm chuẩn giọng Bắc Việt Nam. "
    "Chỉ thay đổi ngữ điệu nhẹ theo dấu câu, tuyệt đối không đổi sang giọng người lớn, giọng dạy học, người kể chuyện trầm, giọng miền Trung, giọng miền Nam, hoặc phát thanh viên."
)

def _get_client():
    global _client
    if not GOOGLE_API_KEY:
        raise ValueError("Thieu GOOGLE_API_KEY trong file .env hoac cau hinh!")
    if _client is None:
        _client = genai.Client(api_key=GOOGLE_API_KEY)
    return _client


def _voice_candidates() -> list[str]:
    return [TTS_VOICE] if TTS_VOICE else []


def _normalize_style(style: str) -> str:
    return UNIFIED_VOICE_STYLE


def _get_cache_path(text: str, style: str) -> str:
    style_key = _normalize_style(style)
    key = f"{LOCAL_TTS_PROMPT_VERSION}||{text.strip()}||{style_key}||{TTS_VOICE}||{TTS_MODEL}"
    hash_val = hashlib.md5(key.encode("utf-8")).hexdigest()
    return os.path.join(CACHE_DIR, f"{hash_val}.wav")


def _silence_bytes(sample_rate: int, duration_ms: int, channels: int = 1, sampwidth: int = 2) -> bytes:
    frame_count = max(0, int(sample_rate * duration_ms / 1000))
    return b"\x00" * frame_count * channels * sampwidth


def _save_wave(pcm_data: bytes, output_path: str, sample_rate: int = TTS_OUTPUT_SAMPLE_RATE):
    import io
    if pcm_data.startswith(b"RIFF"):
        try:
            with wave.open(io.BytesIO(pcm_data), "rb") as wf:
                pcm_data = wf.readframes(wf.getnframes())
        except Exception as e:
            print(f"[TTS] Warning: Failed to extract PCM from WAV data: {e}", flush=True)

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
        f"{UNIFIED_STORY_STYLE} "
        "Đọc hoàn toàn bằng tiếng Việt, rõ dấu và rõ từng từ. "
        "Bắt buộc chỉ dùng duy nhất một giọng bé gái miền Bắc này cho toàn bộ văn bản trong mọi ngữ cảnh. "
        "Dù văn bản là câu hỏi, câu trả lời, hay feedback, vẫn phải giữ nguyên cùng một chất giọng và cùng một màu giọng. "
        "Không được đổi persona, không được đổi vùng giọng, không được già giọng, không được dùng giọng kể chuyện khác. "
        "Giữ tốc độ tự nhiên của trẻ nhỏ nhưng chậm hơn hiện tại một chút, khoảng 8 đến 12 phần trăm, không kéo giọng và không già giọng. "
        "Không nuốt chữ, không bỏ bất kỳ từ nào ở đầu câu hoặc cuối câu, không đọc bằng giọng Anh-Việt. "
        "Trước khi bắt đầu nói hãy nghỉ một nhịp rất ngắn; sau khi đọc xong toàn bộ văn bản hãy giữ một nhịp im lặng rất ngắn. "
        "Nếu văn bản là câu hỏi hay câu nhận xét, vẫn phải đọc bằng chính xác cùng một giọng; "
        "chỉ ngữ điệu lên xuống theo dấu câu một cách tự nhiên, không đổi tone."
    )

    return (
        f"{base_instruction}\n\n"
        "Chỉ đọc nội dung trong mục VĂN BẢN. Không đọc phần hướng dẫn. "
        "Đọc đầy đủ từ đầu tiên đến từ cuối cùng trong VĂN BẢN.\n"
        f"VAN BAN:\n{text.strip()}\n"
        "HẾT VĂN BẢN."
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
        style_key = _normalize_style(style)
        prompt = _build_prompt(text, style_key)
        print(
            f"[TTS] Synthesizing unified_style='{style_key}' voice='{TTS_VOICE}' chars={len(text)} text='{text[:80]}'",
            flush=True,
        )
        audio_data = await asyncio.wait_for(
            _generate_tts_async(client, prompt),
            timeout=TTS_TOTAL_TIMEOUT_SECONDS,
        )
        _save_wave(audio_data, cache_path)
        return cache_path
    except Exception as e:
        print(f"TTS async failed: {e}")
        return ""


async def warm_story_tts_async(story: dict, max_concurrent: int = 3) -> None:
    """
    Pre-generate TTS for all predictable story reply texts in background.
    Runs concurrently (up to max_concurrent) to fill cache before user answers.

    Pre-generates:
      - All question texts
      - All correct-feedback + next-question combos
      - All incorrect-feedback + next-question combos (includes correct_answer)
    """
    from services.story_service import build_question_text, build_feedback_with_next_question

    CORRECT_REASON = "Cậu nhớ đúng ý chính rồi."
    WRONG_REASON = "Câu trả lời này chưa đúng ý truyện."

    questions = story.get("questions", [])
    texts: list[str] = []

    for idx, q in enumerate(questions):
        # Question prompt TTS
        texts.append(build_question_text(story, q, idx))

        next_q = questions[idx + 1] if idx + 1 < len(questions) else None
        next_q_text = build_question_text(story, next_q, idx + 1) if next_q else ""
        completed = next_q is None

        correct_feedback = f"Đúng rồi cậu! {CORRECT_REASON}"
        wrong_feedback = f"Chưa đúng lắm cậu ơi. {WRONG_REASON} Đáp án là: {q['answer'].strip()}"

        texts.append(build_feedback_with_next_question(correct_feedback, next_question_text=next_q_text, completed=completed))
        texts.append(build_feedback_with_next_question(wrong_feedback, next_question_text=next_q_text, completed=completed))

    sem = asyncio.Semaphore(max_concurrent)

    async def _warm_one(text: str):
        async with sem:
            cache_path = _get_cache_path(text, UNIFIED_VOICE_STYLE)
            if os.path.exists(cache_path):
                return
            try:
                client = _get_client()
                prompt = _build_prompt(text)
                audio_data = await asyncio.wait_for(
                    _generate_tts_async(client, prompt),
                    timeout=TTS_TOTAL_TIMEOUT_SECONDS,
                )
                _save_wave(audio_data, cache_path)
                print(f"[TTS-WARM] cached: {text[:60]}", flush=True)
            except Exception as e:
                print(f"[TTS-WARM] skip '{text[:40]}': {e}", flush=True)

    await asyncio.gather(*[_warm_one(t) for t in texts])
    print(f"[TTS-WARM] Done warming {len(texts)} texts.", flush=True)


def synthesize_speech_sync(text: str, style: str = "") -> str:
    if not text.strip():
        return ""

    cache_path = _get_cache_path(text, style)
    if os.path.exists(cache_path):
        return cache_path

    try:
        client = _get_client()
        style_key = _normalize_style(style)
        prompt = _build_prompt(text, style_key)
        audio_data = _generate_tts_sync(client, prompt)
        _save_wave(audio_data, cache_path)
        return cache_path
    except Exception as e:
        print(f"TTS sync failed: {e}")
        return ""
