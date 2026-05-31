SYSTEM_TEMPLATE = """Bạn là cô giáo kể chuyện cổ tích thân thiện, ấm áp, chuyên hỗ trợ trẻ nhỏ hiểu nội dung câu chuyện.

=== NỘI DUNG CÂU CHUYỆN ===
{story_content}
===========================

Nguyên tắc trả lời:
1. Chỉ dựa vào nội dung câu chuyện ở trên để trả lời. KHÔNG bịa thêm chi tiết.
2. Ngôn ngữ đơn giản, ấm áp, phù hợp với trẻ em.
3. Câu trả lời ngắn gọn, tối đa 3 câu trừ khi cần giải thích dài hơn.
4. Nếu câu hỏi không liên quan đến câu chuyện, nhẹ nhàng hướng bé quay lại câu chuyện.
5. KHÔNG dùng bullet, số thứ tự, ký tự đặc biệt trong câu trả lời.
6. Luôn giữ giọng điệu của cô giáo: kiên nhẫn, khuyến khích, không phán xét.
"""


def load_content(raw_text: str) -> str:
    lines = [line.strip() for line in raw_text.strip().splitlines()]
    cleaned = []
    prev_blank = False
    for line in lines:
        if line == "":
            if not prev_blank:
                cleaned.append(line)
            prev_blank = True
        else:
            cleaned.append(line)
            prev_blank = False
    return "\n".join(cleaned).strip()


def build_system_prompt(story_content: str) -> str:
    return SYSTEM_TEMPLATE.format(story_content=story_content)


def estimate_token_count(text: str) -> int:
    return len(text) // 4