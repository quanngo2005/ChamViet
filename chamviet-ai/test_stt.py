import sounddevice as sd
import numpy as np
import io, wave, time, threading, os
from dotenv import load_dotenv
from groq import Groq
from services_AIchamviet.services.stt_service import transcribe_audio_file

load_dotenv()

# ════════════════════════════════════════════════════════
# SETTINGS
# ════════════════════════════════════════════════════════

GROQ_API_KEY      = os.getenv("GROQ_API_KEY", "")
LLM_MODEL         = os.getenv("GROQ_LLM_MODEL", "llama-3.3-70b-versatile")

SAMPLE_RATE       = 16000
SILENCE_TIMEOUT   = 5.0
MIN_AUDIO_SECONDS = 0.5
MIN_VOICE_RATIO   = 0.03
FORCE_THRESHOLD   = None   # None = tự calibrate | số = override thủ công


# ════════════════════════════════════════════════════════
# STORY
# ════════════════════════════════════════════════════════

STORY = """
Ngày xửa ngày xưa, ở vùng đất Lạc Việt, có một vị thần tên là Lạc Long Quân.
Thần có hình dáng của một con rồng, sức mạnh vô song và nhiều phép lạ.
Một ngày, thần gặp nàng Âu Cơ - một tiên nữ xinh đẹp từ trên núi xuống.
Hai người yêu nhau và kết hôn. Âu Cơ sinh ra một bọc trứng, nở ra 100 người con.
Sau đó, Lạc Long Quân dẫn 50 con xuống biển, Âu Cơ dẫn 50 con lên núi.
Người con cả lên ngôi vua, lấy hiệu là Hùng Vương, lập nên nước Văn Lang.
Người Việt Nam là con Rồng cháu Tiên từ đó.
"""

SYSTEM_PROMPT = f"""Bạn là cô giáo thân thiện hỏi đáp về câu chuyện cổ tích với trẻ em.

=== NỘI DUNG CÂU CHUYỆN ===
{STORY}
===========================

Nguyên tắc:
1. Chỉ trả lời dựa trên nội dung câu chuyện trên. KHÔNG bịa thêm.
2. Ngôn ngữ đơn giản, thân thiện, phù hợp trẻ em.
3. Tối đa 2 câu mỗi lần trả lời.
4. Nếu câu hỏi ngoài câu chuyện, nhẹ nhàng hướng về câu chuyện.
5. Trả lời bằng tiếng Việt."""

_groq   = Groq(api_key=GROQ_API_KEY)
history = []


# ════════════════════════════════════════════════════════
# CALIBRATE
# ════════════════════════════════════════════════════════

def calibrate_mic(duration: float = 2.0) -> int:
    if FORCE_THRESHOLD is not None:
        print(f"⚙️  Threshold thủ công: {FORCE_THRESHOLD}")
        return FORCE_THRESHOLD

    print("🎚️  Giữ yên lặng 2 giây để hiệu chỉnh mic...")
    frames = []

    def cb(indata, f, t, s):
        frames.append(indata.copy())

    with sd.InputStream(samplerate=SAMPLE_RATE, channels=1, dtype="int16",
                        blocksize=int(SAMPLE_RATE * 0.1), callback=cb):
        time.sleep(duration)

    noise     = np.concatenate(frames, axis=0)
    avg_amp   = int(np.abs(noise).mean())
    threshold = max(avg_amp * 2, 10)
    print(f"  📊 Noise floor: {avg_amp} | Threshold: {threshold}\n")
    return threshold


# ════════════════════════════════════════════════════════
# RECORD — tự dừng sau SILENCE_TIMEOUT giây không có tiếng
# ════════════════════════════════════════════════════════

def record_auto(threshold: int) -> bytes | None:
    print(f"\n{'─'*52}")
    print(f"🎙️  Đang nghe... tự dừng sau {SILENCE_TIMEOUT}s không có tiếng")
    print(f"{'─'*52}")

    chunks           = []
    last_voice_time  = [time.time()]
    stop_flag        = threading.Event()
    started_speaking = [False]

    def callback(indata, frames, time_info, status):
        chunks.append(indata.copy())
        amp = int(np.abs(indata).mean())

        if amp > threshold:
            last_voice_time[0]  = time.time()
            started_speaking[0] = True

        silence_sec = time.time() - last_voice_time[0]
        bar         = "█" * min(amp // 5, 40)
        icon        = "🔴 TIẾNG" if amp > threshold else "⚪ im   "

        if started_speaking[0]:
            countdown = max(0, SILENCE_TIMEOUT - silence_sec)
            print(f"  {icon} | {bar:<40} | amp={amp:>4} | dừng sau {countdown:.1f}s", end="\r")
        else:
            print(f"  {icon} | {bar:<40} | amp={amp:>4} | chờ tiếng nói...", end="\r")

        if started_speaking[0] and silence_sec >= SILENCE_TIMEOUT:
            stop_flag.set()

    with sd.InputStream(samplerate=SAMPLE_RATE, channels=1, dtype="int16",
                        blocksize=int(SAMPLE_RATE * 0.1), callback=callback):
        while not stop_flag.is_set():
            time.sleep(0.05)

    print(f"\n{'─'*52}")
    print("  ✅ Đã nhận → đang xử lý...")

    if not chunks:
        return None

    audio    = np.concatenate(chunks, axis=0)
    duration = len(audio) / SAMPLE_RATE
    print(f"  ⏱️  Thời lượng    : {duration:.1f}s")

    if duration < MIN_AUDIO_SECONDS:
        print("  ⚠️  Quá ngắn!")
        return None

    chunk_size   = int(SAMPLE_RATE * 0.1)
    total_chunks = len(audio) // chunk_size
    voice_chunks = sum(
        1 for j in range(total_chunks)
        if np.abs(audio[j*chunk_size:(j+1)*chunk_size]).mean() > threshold
    )
    ratio = voice_chunks / total_chunks if total_chunks > 0 else 0
    print(f"  📊 Amp trung bình: {int(np.abs(audio).mean())}")
    print(f"  📊 Amp cao nhất  : {int(np.abs(audio).max())}")
    print(f"  📊 Voice ratio   : {ratio:.0%} ({voice_chunks}/{total_chunks})")

    if ratio < MIN_VOICE_RATIO:
        print("  ⚠️  Voice ratio quá thấp → bỏ qua")
        return None

    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(audio.tobytes())
    return buf.getvalue()


# ════════════════════════════════════════════════════════
# STT
# ════════════════════════════════════════════════════════

def stt(audio_bytes: bytes) -> str:
    print("  🔄 STT → Groq Whisper...")
    t0   = time.time()
    text = transcribe_audio_file(audio_bytes)
    print(f"  📝 STT ({time.time()-t0:.2f}s): {text if text else '(trống)'}")
    return text


# ════════════════════════════════════════════════════════
# LLM
# ════════════════════════════════════════════════════════

def llm(user_text: str) -> str:
    global history
    print("  🤖 LLM → Groq...")
    try:
        history.append({"role": "user", "content": user_text})
        messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history

        t0       = time.time()
        response = _groq.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=256,
        )
        reply = response.choices[0].message.content.strip()
        history.append({"role": "assistant", "content": reply})
        print(f"  💬 LLM ({time.time()-t0:.2f}s): OK")
        return reply
    except Exception as e:
        print(f"  ❌ LLM lỗi: {e}")
        return ""


# ════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 52)
    print(f"🧪 TEST STT → LLM | {LLM_MODEL}")
    print("=" * 52)

    if not GROQ_API_KEY:
        print("❌ Thiếu GROQ_API_KEY trong .env")
        exit(1)

    threshold = calibrate_mic()

    n = 0
    while True:
        n += 1
        print(f"\n🔁 Lượt {n}  (Ctrl+C để thoát)")

        # 1. Thu âm
        audio = record_auto(threshold)
        if not audio:
            print("  ↩️  Bỏ qua\n")
            continue

        # 2. STT
        user_text = stt(audio)
        if not user_text:
            print("  ↩️  Không nhận dạng được\n")
            continue

        # 3. LLM
        reply = llm(user_text)
        if not reply:
            continue

        # 4. Hiển thị
        print(f"\n{'═'*52}")
        print(f"  👤 Bạn : {user_text}")
        print(f"  🤖 Bot : {reply}")
        print(f"  💾 History: {len(history)//2} lượt")
        print(f"{'═'*52}")
