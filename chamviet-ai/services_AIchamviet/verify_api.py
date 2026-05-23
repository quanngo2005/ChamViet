import requests
import time
import io
import wave
import os
import hashlib
import numpy as np

BASE = "http://127.0.0.1:8000"

STORY = """
Ngày xửa ngày xưa, ở vùng đất Lạc Việt, có một vị thần tên là Lạc Long Quân.
Thần có hình dáng của một con rồng, sức mạnh vô song và nhiều phép lạ.
Một ngày, thần gặp nàng Âu Cơ - một tiên nữ xinh đẹp từ trên núi xuống.
Hai người yêu nhau và kết hôn. Âu Cơ sinh ra một bọc trứng, nở ra 100 người con.
Sau đó, Lạc Long Quân dẫn 50 con xuống biển, Âu Cơ dẫn 50 con lên núi.
Người con cả lên ngôi vua, lấy hiệu là Hùng Vương, lập nên nước Văn Lang.
Người Việt Nam là con Rồng cháu Tiên từ đó.
"""

def generate_silent_wav() -> bytes:
    """Tạo file WAV im lặng siêu ngắn."""
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(16000)
        data = np.zeros(1600, dtype=np.int16)
        wf.writeframes(data.tobytes())
    return buf.getvalue()

def run_tests():
    print("=" * 60)
    print("--- BAT DAU KIEM THU TU DONG CAC SERVICE DA TOI UU ---")
    print("=" * 60)

    # 1. Reset
    print("\n1. Goi API Reset...")
    r = requests.post(f"{BASE}/api/reset")
    print(f"   Status: {r.status_code} | Reply: {r.json()}")

    # 2. Load Content
    print("\n2. Goi API Load Content...")
    r = requests.post(f"{BASE}/api/load-content", json={"content": STORY})
    print(f"   Status: {r.status_code} | Reply: {r.json()}")

    # 3. Chat
    print("\n3. Goi API Chat (Gui cau chao)...")
    t0 = time.time()
    r = requests.post(f"{BASE}/api/chat", json={"message": "Chao co giao, hom nay chung ta hoc bai gi a?"})
    t1 = time.time()
    print(f"   Status: {r.status_code} | Thoi gian: {t1-t0:.2f}s")
    print(f"   Co giao phan hoi: {r.json().get('reply')}")

    # 4. Classify Intent
    print("\n4. Goi API Classify Intent (Kiem tra do nhay phan loai y dinh)...")
    test_cases = [
        {"current_question": "Boc trung no ra bao nhieu nguoi con ha be?", "user_text": "con khong biet", "expected": "CONFUSED"},
        {"current_question": "Boc trung no ra bao nhieu nguoi con ha be?", "user_text": "con chiu thoi co oi", "expected": "CONFUSED"},
        {"current_question": "Boc trung no ra bao nhieu nguoi con ha be?", "user_text": "da con hieu roi", "expected": "CONFIRM"},
        {"current_question": "Boc trung no ra bao nhieu nguoi con ha be?", "user_text": "the tai sao Lac Long Quan lai dan con xuong bien a?", "expected": "QUESTION"},
        {"current_question": "Boc trung no ra bao nhieu nguoi con ha be?", "user_text": "No ra mot tram nguoi con a", "expected": "ANSWER"},
    ]
    for i, tc in enumerate(test_cases, 1):
        r = requests.post(f"{BASE}/api/classify", json=tc)
        intent = r.json().get("intent")
        status = "OK [DUNG]" if intent == tc["expected"] else f"ERROR [SAI] (Mong doi {tc['expected']})"
        print(f"   Case {i}: Be noi '{tc['user_text']}' -> Intent: {intent} ({status})")

    # 5. TTS Caching
    print("\n5. Kiem tra tinh nang Smart TTS Caching...")
    text_to_speak = "Kiem tra cache hoat dong tot"
    style = "chao"
    
    # Pre-populate cache manually to simulate a successful API call from the past
    key = f"{text_to_speak.strip()}||{style.strip()}||Kore||gemini-2.5-flash-preview-tts"
    hash_val = hashlib.md5(key.encode("utf-8")).hexdigest()
    cache_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".cache", "tts"))
    os.makedirs(cache_dir, exist_ok=True)
    cache_file_path = os.path.join(cache_dir, f"{hash_val}.wav")
    
    print(f"   [Mock] Tao file cache gia lap tai: {cache_file_path}")
    wav_mock_data = generate_silent_wav()
    with open(cache_file_path, "wb") as f:
        f.write(wav_mock_data)

    print("   Goi API speak (mong doi cache hit thong qua file gia lap, khong can qua Gemini):")
    t0 = time.time()
    r_cache = requests.post(f"{BASE}/api/speak", json={"text": text_to_speak, "style": style})
    t1 = time.time()
    
    print(f"   Status: {r_cache.status_code} | Thoi gian phan hoi: {t1-t0:.4f}s | Kich thuoc WAV: {len(r_cache.content)} bytes")
    
    if r_cache.status_code == 200 and len(r_cache.content) == len(wav_mock_data):
        print(f"   SUCCESS: TTS Cache hoat dong HOAN HAO! Toc do phan hoi sieu toc ({t1-t0:.4f}s) va bo qua loi API key expired!")
    else:
        print("   ERROR: TTS Cache test that bai.")

    # 6. STT
    print("\n6. Kiem tra API Transcribe STT (Whisper)...")
    wav_bytes = generate_silent_wav()
    r = requests.post(
        f"{BASE}/api/transcribe",
        files={"audio": ("rec.wav", wav_bytes, "audio/wav")}
    )
    print(f"   Status: {r.status_code} | Ket qua nhan dang: '{r.json().get('text')}'")
    
    print("\n" + "=" * 60)
    print("--- TAT CA KIEM THU DA HOAN THANH ---")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
