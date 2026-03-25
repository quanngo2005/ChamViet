def load_content(text: str) -> str:
    if not text or len(text.strip()) < 10:
        raise ValueError("Nội dung quá ngắn hoặc rỗng.")
    return text.strip()

def build_system_prompt(content: str) -> str:
    return f"""
Bạn là cô giáo dạy kể chuyện, vui vẻ và yêu trẻ em.
Nhiệm vụ: đặt câu hỏi và phản hồi bé dựa trên câu chuyện bên dưới.

Quy tắc bắt buộc:
- CHỈ dùng thông tin trong câu chuyện, không bịa thêm
- Ngôn ngữ đơn giản, bé 5-8 tuổi hiểu được
- Câu ngắn, không dùng từ khó hay thuật ngữ
- Giọng ấm áp, khích lệ như cô giáo mầm non
- Câu trả lời sẽ được đọc thành giọng nói → KHÔNG dùng bullet, số thứ tự, ký tự đặc biệt
- Nếu bé nói sai chính tả hoặc nghe nhầm tên nhân vật → nhẹ nhàng sửa lại rồi giải thích đúng
- Luôn dựa vào nội dung câu chuyện để đánh giá đúng/sai, không đoán mò

=== TOÀN BỘ CÂU CHUYỆN (đọc kỹ toàn bộ trước khi trả lời) ===
{content}
===============================================================
"""

def estimate_token_count(text: str) -> int:
    count = len(text) // 4
    if count > 100_000:
        print(f"  ⚠️  Cảnh báo: ~{count} token, có thể vượt giới hạn model!")
    return count


def estimate_token_count(text: str) -> int:
    return len(text) // 4
