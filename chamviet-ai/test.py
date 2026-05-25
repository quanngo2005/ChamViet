import requests
import sounddevice as sd
import soundfile as sf
import numpy as np
import io, time, threading

BASE              = "http://127.0.0.1:8000"
MIN_VOICE_RATIO   = 0.03
MIN_AUDIO_SECONDS = 0.3
SILENCE_TIMEOUT   = 5.0
PRE_ROLL_CHUNKS   = 5       # ~0.5s buffer trước khi phát hiện tiếng
FORCE_THRESHOLD   = None    # None = tự calibrate | số = override

SAMPLE_RATE = 16000         # sẽ bị ghi đè sau calibrate_mic()

STORY = """
Ngày xửa ngày xưa, ở vùng đất Lạc Việt, có một vị thần tên là Lạc Long Quân.
Thần có hình dáng của một con rồng, sức mạnh vô song và nhiều phép lạ.
Một ngày, thần gặp nàng Âu Cơ - một tiên nữ xinh đẹp từ trên núi xuống.
Hai người yêu nhau và kết hôn. Âu Cơ sinh ra một bọc trứng, nở ra 100 người con.
Sau đó, Lạc Long Quân dẫn 50 con xuống biển, Âu Cơ dẫn 50 con lên núi.
Người con cả lên ngôi vua, lấy hiệu là Hùng Vương, lập nên nước Văn Lang.
Người Việt Nam là con Rồng cháu Tiên từ đó.
"""

STOP_KEYWORDS = ["tạm biệt", "kết thúc", "dừng lại", "thôi", "bye"]


# ════════════════════════════════════════════════════════
# CALIBRATE
# ════════════════════════════════════════════════════════

def calibrate_mic(duration: float = 2.0) -> tuple[int, int]:
    """Trả về (threshold, actual_sample_rate)."""
    global SAMPLE_RATE

    # Lấy sample rate thực tế của mic
    device_info = sd.query_devices(kind="input")
    actual_sr   = int(device_info["default_samplerate"])
    SAMPLE_RATE = actual_sr
    print(f"  🎙️  Mic device : {device_info['name']}")
    print(f"  🎙️  Sample rate: {actual_sr} Hz")

    if FORCE_THRESHOLD is not None:
        print(f"  ⚙️  Threshold thủ công: {FORCE_THRESHOLD}")
        return FORCE_THRESHOLD, actual_sr

    print("\n🎚️  Hiệu chỉnh mic — giữ yên lặng trong 2 giây...")
    frames = []

    def cb(indata, f, t, s):
        frames.append(indata.copy())

    with sd.InputStream(samplerate=actual_sr, channels=1, dtype="int16",
                        blocksize=int(actual_sr * 0.1), callback=cb):
        time.sleep(duration)

    noise     = np.concatenate(frames, axis=0)
    avg_amp   = int(np.abs(noise).mean())
    threshold = max(int(avg_amp * 1.5), 8)
    print(f"  📊 Noise floor: {avg_amp} | Threshold: {threshold}")
    return threshold, actual_sr


# ════════════════════════════════════════════════════════
# AUDIO UTILS
# ════════════════════════════════════════════════════════

def _reduce_noise(audio: np.ndarray) -> np.ndarray:
    """Spectral gating đơn giản — loại mẫu dưới 50% RMS."""
    rms  = np.sqrt(np.mean(audio.astype(np.float32) ** 2))
    mask = np.abs(audio) > (rms * 0.5)
    return (audio * mask).astype(np.int16)


def _build_wav(audio: np.ndarray, sr: int) -> bytes:
    """Normalize int16 → float32, export WAV chuẩn cho Whisper."""
    audio_f32 = audio.astype(np.float32) / 32768.0
    peak = np.abs(audio_f32).max()
    if peak > 0:
        audio_f32 = audio_f32 / peak * 0.95

    buf = io.BytesIO()
    with sf.SoundFile(buf, mode="w", samplerate=sr,
                      channels=1, format="WAV", subtype="FLOAT") as f:
        f.write(audio_f32)
    buf.seek(0)
    return buf.read()


def play_wav(audio_bytes: bytes):
    buf = io.BytesIO(audio_bytes)
    data, sr = sf.read(buf)
    sd.play(data, sr)
    sd.wait()


def speak(text: str, style: str = ""):
    if not text:
        return
    print(f"\n🔊 Cô giáo: {text}")
    r = requests.post(f"{BASE}/api/speak", json={"text": text, "style": style})
    if r.status_code == 200:
        play_wav(r.content)
    else:
        print(f"  ❌ TTS lỗi {r.status_code}")


# ════════════════════════════════════════════════════════
# RECORD — tự dừng sau SILENCE_TIMEOUT giây im lặng
# ════════════════════════════════════════════════════════

def record_auto(threshold: int, sr: int, debug: bool = False) -> bytes | None:
    print(f"\n{'─'*52}")
    print(f"🎙️  Đang nghe... tự dừng sau {SILENCE_TIMEOUT}s không có tiếng")
    print(f"{'─'*52}")

    chunks           = []
    pre_roll         = []
    last_voice_time  = [time.time()]
    stop_flag        = threading.Event()
    started_speaking = [False]

    def callback(indata, frames, time_info, status):
        data = indata.copy()
        amp  = int(np.abs(data).mean())

        # Duy trì pre-roll buffer khi chưa nói
        if not started_speaking[0]:
            pre_roll.append(data)
            if len(pre_roll) > PRE_ROLL_CHUNKS:
                pre_roll.pop(0)

        if amp > threshold:
            if not started_speaking[0]:
                chunks.extend(pre_roll)   # flush pre-roll để không mất đầu câu
                pre_roll.clear()
                started_speaking[0] = True
            last_voice_time[0] = time.time()

        if started_speaking[0]:
            chunks.append(data)

        silence_sec = time.time() - last_voice_time[0]
        bar  = "█" * min(amp // 5, 40)
        icon = "🔴 TIẾNG" if amp > threshold else "⚪ im   "

        if started_speaking[0]:
            countdown = max(0, SILENCE_TIMEOUT - silence_sec)
            print(f"  {icon} | {bar:<40} | amp={amp:>4} | dừng sau {countdown:.1f}s", end="\r")
        else:
            print(f"  {icon} | {bar:<40} | amp={amp:>4} | chờ tiếng nói...", end="\r")

        if started_speaking[0] and silence_sec >= SILENCE_TIMEOUT:
            stop_flag.set()

    with sd.InputStream(samplerate=sr, channels=1, dtype="int16",
                        blocksize=int(sr * 0.1), callback=callback):
        while not stop_flag.is_set():
            time.sleep(0.05)

    print(f"\n{'─'*52}")
    print("  ✅ Đã nhận → đang xử lý...")

    if not chunks:
        return None

    audio    = np.concatenate(chunks, axis=0)
    duration = len(audio) / sr
    print(f"  ⏱️  Thời lượng    : {duration:.1f}s")

    if duration < MIN_AUDIO_SECONDS:
        print("  ⚠️  Audio quá ngắn")
        return None

    chunk_size   = int(sr * 0.1)
    total_chunks = len(audio) // chunk_size
    if total_chunks == 0:
        return None

    voice_chunks = sum(
        1 for j in range(total_chunks)
        if np.abs(audio[j*chunk_size:(j+1)*chunk_size]).mean() > threshold
    )
    voice_ratio = voice_chunks / total_chunks
    print(f"  📊 Amp trung bình: {int(np.abs(audio).mean())}")
    print(f"  📊 Amp cao nhất  : {int(np.abs(audio).max())}")
    print(f"  📊 Voice ratio   : {voice_ratio:.0%} ({voice_chunks}/{total_chunks})")

    if voice_ratio < MIN_VOICE_RATIO:
        print("  ⚠️  Không đủ tiếng nói")
        return None

    # Noise reduction + normalize + build WAV
    audio    = _reduce_noise(audio)
    wav_data = _build_wav(audio, sr)

    # Debug: lưu file để kiểm tra bằng tai
    if debug:
        path = f"debug_{int(time.time())}.wav"
        with open(path, "wb") as f:
            f.write(wav_data)
        print(f"  🔍 Debug audio: {path}")

    return wav_data


# ════════════════════════════════════════════════════════
# STT
# ════════════════════════════════════════════════════════

def transcribe(audio_bytes: bytes) -> str:
    r = requests.post(
        f"{BASE}/api/transcribe",
        files={"audio": ("rec.wav", audio_bytes, "audio/wav")}
    )
    if r.status_code != 200:
        print(f"  ❌ STT lỗi {r.status_code}: {r.text}")
        return ""
    text = r.json().get("text", "").strip()
    if len(text) < 2:
        return ""
    print(f"  📝 Bạn nói: {text}")
    return text


def get_voice_input(threshold: int, sr: int, debug: bool = False) -> str:
    while True:
        audio = record_auto(threshold, sr, debug=debug)
        if not audio:
            speak("Cô chưa nghe rõ, bé nói lại nhé!", style="nhac_lai")
            continue
        text = transcribe(audio)
        if not text:
            speak("Cô chưa nghe rõ, bé nói to hơn nhé!", style="nhac_lai")
            continue
        return text


# ════════════════════════════════════════════════════════
# API
# ════════════════════════════════════════════════════════

def load_story():
    r    = requests.post(f"{BASE}/api/load-content", json={"content": STORY})
    info = r.json()
    print(f"  ✅ chars={info['chars']} | ~{info['token_estimate']} token")


def chat(message: str) -> str:
    r = requests.post(f"{BASE}/api/chat", json={"message": message})
    return r.json().get("reply", "") if r.status_code == 200 else ""


def classify(current_question: str, user_text: str) -> str:
    r = requests.post(f"{BASE}/api/classify", json={
        "current_question": current_question,
        "user_text"       : user_text,
    })
    return r.json().get("intent", "ANSWER") if r.status_code == 200 else "ANSWER"


def reset():
    requests.post(f"{BASE}/api/reset")


# ════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--debug", action="store_true",
                        help="Lưu file WAV debug ra disk sau mỗi lượt ghi")
    args = parser.parse_args()

    print("=" * 52)
    print("🎙️  VOICE CHAT — Hỏi đáp câu chuyện cổ tích")
    print("=" * 52)

    # 1. Calibrate mic — lấy threshold + actual sample rate
    threshold, sr = calibrate_mic()
    if args.debug:
        print(f"  🐛 Debug mode ON — WAV sẽ được lưu ra disk")

    # 2. Load câu chuyện lên server
    print("\n📚 Đang load câu chuyện...")
    load_story()

    # 3. Cô giáo chào
    greeting = chat(
        "Hãy chào bé và giới thiệu hôm nay chúng ta sẽ nói chuyện về "
        "câu chuyện Lạc Long Quân và Âu Cơ. Hỏi bé đã sẵn sàng chưa."
    )
    speak(greeting, style="chao")

    print("\n💬 Nói chuyện tự nhiên — tự dừng sau 5s im lặng")
    print("   Nói 'tạm biệt' để kết thúc\n")

    last_question = ""

    # 4. Vòng lặp hỏi đáp
    while True:
        user_text = get_voice_input(threshold, sr, debug=args.debug)

        # Kết thúc
        if any(kw in user_text.lower() for kw in STOP_KEYWORDS):
            farewell = chat("Hãy tạm biệt bé thân thiện và kết thúc buổi trò chuyện.")
            speak(farewell, style="ket_thuc")
            reset()
            print("\n✅ Kết thúc!")
            break

        # Classify intent nếu có câu hỏi trước đó
        if last_question:
            intent = classify(last_question, user_text)
            print(f"  🔍 Intent: {intent}")

            if intent == "CONFUSED":
                reply = chat(
                    f'Bé nói không biết câu hỏi: "{last_question}". '
                    f"Hãy động viên và gợi ý nhỏ từ nội dung câu chuyện, không nói thẳng đáp án."
                )
                speak(reply, style="dong_vien")
                continue

            if intent == "QUESTION":
                reply = chat(
                    f'Bé hỏi: "{user_text}". '
                    f"Giải thích dựa vào nội dung câu chuyện, tối đa 2 câu."
                )
                speak(reply, style="giai_thich")
                continue

            if intent == "CONFIRM":
                reply = chat(
                    "Bé vừa xác nhận đã hiểu. "
                    "Hãy khích lệ và hỏi bé có muốn biết thêm gì không."
                )
                speak(reply, style="khen")
                last_question = ""
                continue

        # ANSWER hoặc lượt mới
        reply = chat(user_text)
        speak(reply, style="giai_thich")
        last_question = user_text