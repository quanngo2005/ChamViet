# -*- coding: utf-8 -*-
"""
test_pipeline.py
================
Test luong hoi dap theo story.json:
  Doc tung cau hoi -> thu am cau tra loi -> Groq Whisper STT
  -> LLM cham diem -> TTS phan hoi -> chuyen cau tiep theo.

Cach dung:
  python test_pipeline.py

Nhan Enter de bat dau ghi am, nhan Enter lan nua de dung.
Go 'q' + Enter truoc khi ghi am de thoat.
"""

import asyncio
import io
import os
import sys
import wave

sys.path.insert(0, os.path.dirname(__file__))

import numpy as np

from config import (
    EMBEDDING_MODEL_NAME,
    LLM_PROVIDER,
    STT_LANGUAGE,
    STT_MODEL,
    STT_PROVIDER,
    TEST_AUDIO_CHANNELS,
    TEST_AUDIO_DTYPE,
    TEST_AUDIO_SAMPLE_RATE,
    TEST_MIN_AUDIO_SECONDS,
    get_active_llm_model,
)

try:
    import sounddevice as sd
    import soundfile as sf
except ImportError:
    print("Thieu thu vien: pip install sounddevice soundfile")
    sys.exit(1)

from services.llm_service import evaluate_story_answer, preload_embedding_model_async
from services.story_service import build_question_text, load_story
from services.stt_service import transcribe_audio_file
from services.tts_service import UNIFIED_VOICE_STYLE, synthesize_speech


SAMPLE_RATE = TEST_AUDIO_SAMPLE_RATE
CHANNELS = TEST_AUDIO_CHANNELS
DTYPE = TEST_AUDIO_DTYPE


def record_audio_interactive() -> bytes | None:
    """
    Ghi am tu microphone.
    Nhan Enter de bat dau, Enter lan nua de dung.
    """
    print("\n[MIC] Nhan [Enter] de bat dau tra loi, hoac go 'q' de thoat...", end="", flush=True)
    cmd = input()
    if cmd.strip().lower() == "q":
        return None

    frames: list[np.ndarray] = []
    def callback(indata, frame_count, time_info, status):
        if status:
            print(f"Audio status: {status}", flush=True)
        frames.append(indata.copy())

    print("[REC] Dang ghi... Nhan [Enter] de dung.")

    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        dtype=DTYPE,
        callback=callback,
    ):
        input()

    if not frames:
        print("[!] Khong co audio duoc ghi.")
        return None

    audio_np = np.concatenate(frames, axis=0)
    if audio_np.shape[0] < SAMPLE_RATE * TEST_MIN_AUDIO_SECONDS:
        print(f"[!] Am thanh qua ngan (< {TEST_MIN_AUDIO_SECONDS}s), bo qua.")
        return None

    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(audio_np.tobytes())
    return buf.getvalue()


def play_audio(wav_path: str):
    """Phat file WAV qua loa mac dinh."""
    try:
        data, samplerate = sf.read(wav_path, dtype="float32")
        print(f"[SPK] Dang phat: {os.path.basename(wav_path)}")
        sd.play(data, samplerate)
        sd.wait()
    except Exception as e:
        print(f"[ERR] Loi phat audio: {e}")


async def speak(text: str, style: str = UNIFIED_VOICE_STYLE):
    print(f"[BAN] {text}")
    wav_path = await synthesize_speech(text, style=UNIFIED_VOICE_STYLE)
    if not wav_path:
        print("[!] TTS khong tao duoc audio, chi hien thi text.")
        return
    play_audio(wav_path)


async def ask_and_score_question(story: dict, question: dict, question_index: int) -> bool:
    question_text = build_question_text(story, question, question_index)

    print("\n" + "-" * 60)
    print(f"[Q{question_index + 1}/{len(story['questions'])}] {question['question']}")
    await speak(question_text)

    audio_bytes = record_audio_interactive()
    if audio_bytes is None:
        return False

    print(f"\n[STT] Dang nhan dang giong noi bang {STT_PROVIDER} {STT_MODEL}...", flush=True)
    user_text = await transcribe_audio_file(audio_bytes, language=STT_LANGUAGE)
    if not user_text:
        feedback = (
            "Tớ chưa nghe rõ câu trả lời của cậu."
            f"Câu trả lời đúng là: {question['answer']}"
        )
        await speak(feedback)
        return True

    print(f"[BE] {user_text}")
    print("[LLM] Dang xac nhan cau tra loi bang LLM...", flush=True)

    evaluation = await evaluate_story_answer(
        question=question["question"],
        correct_answer=question["answer"],
        user_answer=user_text,
        story_title=story["story"],
    )

    score = evaluation["score"]
    is_correct = evaluation["is_correct"]
    print(f"[SCORE] {score:.1f}/100 - {'Dung' if is_correct else 'Can sua'}")
    if evaluation.get("reason"):
        print(f"[REASON] {evaluation['reason']}")
    print(f"[FEEDBACK] {evaluation['feedback']}")

    await speak(evaluation["feedback"])
    return True


async def main():
    print("=" * 60)
    print("  TEST STORY: story.json -> STT Groq -> LLM cham diem -> TTS")
    print("=" * 60)

    print(f"[EMBEDDING] Dang load model: {EMBEDDING_MODEL_NAME}...", flush=True)
    await preload_embedding_model_async()
    print("[EMBEDDING] Model da san sang.", flush=True)

    try:
        default_input = sd.query_devices(kind="input")
        default_output = sd.query_devices(kind="output")
        print(f"[MIC] {default_input['name']}")
        print(f"[SPK] {default_output['name']}")
    except Exception as e:
        print(f"[!] Khong tim thay thiet bi am thanh: {e}")
        print("    Kiem tra lai microphone va loa.")
        return

    try:
        story = load_story()
    except Exception as e:
        print(f"[!] Khong doc duoc story.json: {e}")
        return

    print(f"\n[STORY] {story['story']}")
    print(f"[TOTAL] {len(story['questions'])} cau hoi")
    print(f"[STT] Provider: {STT_PROVIDER} | Model: {STT_MODEL}")
    print(f"[LLM] Provider: {LLM_PROVIDER} | Model: {get_active_llm_model()}")

    for index, question in enumerate(story["questions"]):
        should_continue = await ask_and_score_question(story, question, index)
        if not should_continue:
            print("\nKet thuc test theo yeu cau.")
            break
    else:
        await speak("To va cau da tra loi xong tat ca cau hoi roi. Cau gioi lam!")

    print("\nTest hoan tat.")


if __name__ == "__main__":
    asyncio.run(main())
