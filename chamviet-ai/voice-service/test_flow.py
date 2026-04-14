import requests, sounddevice as sd, soundfile as sf
import numpy as np, io, wave, time, threading
from data.story import STORY_TITLE, CHILD_AGE, STORY, QA_LIST

BASE              = "http://127.0.0.1:8000"
SAMPLE_RATE       = 16000
SILENCE_THRESHOLD = 150
MIN_VOICE_RATIO   = 0.15
MIN_AUDIO_SECONDS = 0.3
COSINE_THRESHOLD  = 0.6
MAX_CHILD_Q       = 2

WHISPER_HALLUCINATIONS = [
    "subscribe", "like", "kênh", "video", "youtube",
    "cảm ơn bạn đã xem", "hẹn gặp lại", "đừng quên",
]


# ════════════════════════════════════════════════
# AUDIO
# ════════════════════════════════════════════════

def play_audio_bytes(audio_bytes: bytes):
    buf = io.BytesIO(audio_bytes)
    data, sr = sf.read(buf)
    sd.play(data, sr); sd.wait()


def speak(text: str):
    if not text:
        return
    print(f"\n🔊 {text}")
    r = requests.post(f"{BASE}/api/speak", json={"text": text})
    if r.status_code == 200:
        play_audio_bytes(r.content)
    else:
        print(f"  ❌ TTS lỗi {r.status_code}")


def record_until_q(sr=SAMPLE_RATE) -> bytes | None:
    print(f"\n{'─'*55}")
    print("🎙️  Mic đang mở... Nói xong bấm  q + Enter  để gửi")
    print(f"{'─'*55}")

    chunks = []; stop_flag = threading.Event()

    def wait_for_q():
        while True:
            if input().strip().lower() == "q":
                stop_flag.set(); break

    threading.Thread(target=wait_for_q, daemon=True).start()

    def callback(indata, frames, time_info, status):
        chunks.append(indata.copy())
        amplitude = int(np.abs(indata).mean())
        bar  = "█" * min(amplitude // 10, 40)
        icon = "🔴 TIẾNG" if amplitude > SILENCE_THRESHOLD else "⚪ im   "
        print(f"  {icon} | {bar:<40} | amp={amplitude:>4}", end="\r")

    with sd.InputStream(samplerate=sr, channels=1, dtype='int16',
                        blocksize=int(sr * 0.1), callback=callback):
        while not stop_flag.is_set():
            time.sleep(0.05)

    print(f"\n{'─'*55}")
    print("  ✅ Đã nhận → đang xử lý...")

    if not chunks:
        return None

    audio = np.concatenate(chunks, axis=0)
    if len(audio) / sr < MIN_AUDIO_SECONDS:
        print("  ⚠️  Audio quá ngắn"); return None

    chunk_size   = int(sr * 0.1)
    total_chunks = len(audio) // chunk_size
    if total_chunks == 0:
        return None

    voice_chunks = sum(
        1 for j in range(total_chunks)
        if np.abs(audio[j*chunk_size:(j+1)*chunk_size]).mean() > SILENCE_THRESHOLD
    )
    voice_ratio = voice_chunks / total_chunks
    print(f"  📊 Voice ratio: {voice_ratio:.0%} ({voice_chunks}/{total_chunks})")

    if voice_ratio < MIN_VOICE_RATIO:
        print("  ⚠️  Không đủ tiếng nói"); return None

    voiced = [
        audio[j*chunk_size:(j+1)*chunk_size]
        for j in range(total_chunks)
        if np.abs(audio[j*chunk_size:(j+1)*chunk_size]).mean() > SILENCE_THRESHOLD // 2
    ]
    if not voiced:
        return None

    clean_audio = np.concatenate(voiced, axis=0)
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(1); wf.setsampwidth(2)
        wf.setframerate(sr); wf.writeframes(clean_audio.tobytes())
    return buf.getvalue()


def transcribe(audio_bytes: bytes) -> str:
    r = requests.post(f"{BASE}/api/transcribe",
                      files={"audio": ("rec.wav", audio_bytes, "audio/wav")})
    if r.status_code != 200:
        return ""
    text = r.json().get("text", "").strip()
    if any(bad in text.lower() for bad in WHISPER_HALLUCINATIONS):
        return ""
    if len(text) < 3:
        return ""
    print(f"  📝 Bé nói: {text}")
    return text


def get_valid_audio() -> str:
    while True:
        audio = record_until_q()
        if not audio:
            speak("Bé thử nói lại nhé!"); continue
        text = transcribe(audio)
        if not text:
            speak("Cô chưa nghe rõ, bé nói to hơn nhé!"); continue
        return text


# ════════════════════════════════════════════════
# API CALLERS
# ════════════════════════════════════════════════

def _post(endpoint: str, body: dict) -> dict:
    r = requests.post(f"{BASE}{endpoint}", json=body)
    if r.status_code != 200:
        print(f"  ❌ {endpoint} lỗi {r.status_code}: {r.text[:100]}")
        return {}
    return r.json()


def api_greeting() -> str:
    return _post("/api/greeting", {
        "story_title": STORY_TITLE,
        "child_age"  : CHILD_AGE,
    }).get("text", "")


def api_read_question(question: str) -> str:
    # Tự luận — không truyền options
    return _post("/api/read-question", {
        "story_title": STORY_TITLE,
        "child_age"  : CHILD_AGE,
        "question"   : question,
    }).get("text", "")


def api_cosine_match(user_text: str, correct_answer: str) -> float:
    res = _post("/api/match", {
        "user_text"    : user_text,
        "correct_answer": correct_answer,
    })
    return res.get("score", 0.0)


def api_classify(current_question: str, user_text: str) -> str:
    return _post("/api/classify", {
        "current_question": current_question,
        "user_text"       : user_text,
    }).get("intent", "UNCLEAR").strip().upper()


def api_correct(question: str, child_answer: str, correct_answer: str) -> str:
    return _post("/api/correct", {
        "story_title"  : STORY_TITLE,
        "child_age"    : CHILD_AGE,
        "question"     : question,
        "child_answer" : child_answer,
        "correct_answer": correct_answer,
    }).get("text", "")


def api_wrong(question: str, child_answer: str, correct_answer: str) -> str:
    return _post("/api/wrong", {
        "story_title"  : STORY_TITLE,
        "child_age"    : CHILD_AGE,
        "question"     : question,
        "child_answer" : child_answer,
        "correct_answer": correct_answer,
    }).get("text", "")


def api_unclear(question: str) -> str:
    return _post("/api/unclear", {
        "story_title": STORY_TITLE,
        "child_age"  : CHILD_AGE,
        "question"   : question,
    }).get("text", "")


def api_confused(question: str, correct_answer: str) -> str:
    return _post("/api/confused", {
        "story_title"  : STORY_TITLE,
        "child_age"    : CHILD_AGE,
        "question"     : question,
        "correct_answer": correct_answer,
    }).get("text", "")


def api_explain(child_question: str) -> str:
    return _post("/api/explain", {
        "story_title"   : STORY_TITLE,
        "child_age"     : CHILD_AGE,
        "child_question": child_question,
    }).get("text", "")


def api_after_explain(original_question: str) -> str:
    return _post("/api/after-explain", {
        "child_age"        : CHILD_AGE,
        "original_question": original_question,
    }).get("text", "")


def api_ending(score: int, total: int) -> str:
    return _post("/api/ending", {
        "story_title": STORY_TITLE,
        "child_age"  : CHILD_AGE,
        "score"      : score,
        "total"      : total,
    }).get("text", "")


# ════════════════════════════════════════════════
# MAIN FLOW
# ════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 55)
    print(f"🚀 {STORY_TITLE} | Bé {CHILD_AGE} tuổi")
    print("=" * 55)

    # ── Load story ──
    print("\n📚 Load câu chuyện...")
    r = requests.post(f"{BASE}/api/load-content", json={"content": STORY})
    info = r.json()
    print(f"  ✅ chars={info['chars']} | ~{info['token_estimate']} token")

    # ── Chào bé + chờ xác nhận ──
    speak(api_greeting())
    get_valid_audio()

    score = 0
    total = len(QA_LIST)

    for i, qa in enumerate(QA_LIST, 1):
        question       = qa["question"]
        correct_answer = qa["answer"]

        print(f"\n{'═'*55}")
        print(f"❓ Câu {i}/{total}: {question}")
        print(f"   ✔️  Đáp án chuẩn: {correct_answer}")

        # Đọc câu hỏi
        speak(api_read_question(question))

        child_q_count = 0
        answered      = False

        while not answered:
            user_text = get_valid_audio()

            # ── Bước 1: classify intent trước ──
            intent = api_classify(question, user_text)
            print(f"  🔍 Intent: {intent}")

            if "QUESTION" in intent:
                # Bé hỏi về nội dung câu chuyện
                child_q_count += 1
                print(f"  💬 Bé hỏi ({child_q_count}/{MAX_CHILD_Q})")
                speak(api_explain(user_text))
                speak(api_after_explain(question))
                continue

            if "CONFUSED" in intent:
                # Bé không biết
                speak(api_confused(question, correct_answer))
                continue

            # ── Bước 2: ANSWER / CONFIRM → cosine so sánh ──
            score_val = api_cosine_match(user_text, correct_answer)
            print(f"  📐 Cosine score: {score_val:.0%}")

            if score_val >= COSINE_THRESHOLD:
                # ĐÚNG
                print(f"  ✅ ĐÚNG ({score_val:.0%})")
                score += 1
                speak(api_correct(question, user_text, correct_answer))

                # Chờ bé phản hồi (thắc mắc hay không)
                followup        = get_valid_audio()
                followup_intent = api_classify(question, followup)
                print(f"  🔍 Follow-up intent: {followup_intent}")

                if "QUESTION" in followup_intent:
                    speak(api_explain(followup))
                    get_valid_audio()  # chờ bé xác nhận hiểu

                answered = True

            elif score_val >= 0.35:
                # Gần đúng nhưng chưa rõ → nhắc bé nói rõ hơn
                print(f"  ❓ Chưa rõ ({score_val:.0%})")
                speak(api_unclear(question))

            else:
                # SAI hoàn toàn
                print(f"  ❌ SAI ({score_val:.0%})")
                speak(api_wrong(question, user_text, correct_answer))

                # Chờ bé phản hồi sau giải thích
                followup        = get_valid_audio()
                followup_intent = api_classify(question, followup)
                print(f"  🔍 Follow-up intent: {followup_intent}")

                if "QUESTION" in followup_intent:
                    speak(api_explain(followup))
                    get_valid_audio()

                answered = True

        time.sleep(0.3)

    # ── Kết thúc ──
    print(f"\n{'═'*55}")
    print(f"🏆 Kết quả: {score}/{total}")
    speak(api_ending(score, total))

    requests.post(f"{BASE}/api/reset")
    print("\n✅ Hoàn tất!")
