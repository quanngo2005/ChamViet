import re
from groq import AsyncGroq, Groq
from config import GROQ_API_KEY, GROQ_LLM_MODEL

_async_client = None
_client = None


def _get_async_client() -> AsyncGroq:
    global _async_client
    if _async_client is None:
        _async_client = AsyncGroq(api_key=GROQ_API_KEY)
    return _async_client


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


async def get_answer(
    user_message: str,
    system_prompt: str,
    history: list,
    temperature: float = 0.7,
    max_tokens: int = 512,
) -> str:
    try:
        client = _get_async_client()
        messages = [{"role": "system", "content": system_prompt}]
        messages += history
        messages.append({"role": "user", "content": user_message})

        response = await client.chat.completions.create(
            model=GROQ_LLM_MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"LLM async error: {e}")
        return ""


def get_answer_sync(
    user_message: str,
    system_prompt: str,
    history: list,
    temperature: float = 0.7,
    max_tokens: int = 512,
) -> str:
    try:
        client = _get_client()
        messages = [{"role": "system", "content": system_prompt}]
        messages += history
        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model=GROQ_LLM_MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"LLM sync error: {e}")
        return ""


def _strip_accents(text: str) -> str:
    """Loại bỏ dấu tiếng Việt để so khớp từ khóa chính xác nhất."""
    patterns = {
        '[àáảãạăằắẳẵặâầấẩẫậ]': 'a',
        '[èéẻẽẹêềếểễệ]': 'e',
        '[ìíỉĩị]': 'i',
        '[òóỏõọôồốổỗộơờớởỡợ]': 'o',
        '[ùúủũụưừứửữự]': 'u',
        '[ỳýỷỹỵ]': 'y',
        '[đ]': 'd',
        '[ÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬ]': 'A',
        '[ÈÉẺẼẸÊỀẾỂỄỆ]': 'E',
        '[ÌÍỈĨỊ]': 'I',
        '[ÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢ]': 'O',
        '[ÙÚỦŨỤƯỪỨỬỮỰ]': 'U',
        '[ỲÝỶỸÝ]': 'Y',
        '[Đ]': 'D'
    }
    for pattern, replacement in patterns.items():
        text = re.sub(pattern, replacement, text)
    return text


async def classify_intent(question: str, user_text: str, system_prompt: str) -> str:
    """
    Phân loại ý định của trẻ em một cách cực kỳ mạnh mẽ.
    Kết hợp LLM + làm sạch Regex + Bộ đối sánh từ khóa tiếng Việt đặc trưng của trẻ nhỏ (hỗ trợ cả có dấu và không dấu).
    """
    prompt = (
        f'Cô hỏi bé: "{question}"\n'
        f'Bé nói: "{user_text}"\n\n'
        "Hãy phân loại phản hồi của bé thành một trong bốn nhóm ý định sau:\n"
        "- ANSWER   -> Bé đang cố gắng trả lời câu hỏi của cô giáo (cho dù đúng hay sai).\n"
        "- QUESTION -> Bé đang đặt câu hỏi ngược lại cho cô giáo hoặc thắc mắc về nội dung truyện.\n"
        "- CONFIRM  -> Bé đồng ý, xác nhận đã hiểu hoặc đã nghe rõ (ví dụ: dạ, vâng, ừ ạ, hiểu rồi, vâng ạ).\n"
        "- CONFUSED -> Bé không biết câu trả lời, không nhớ, hoặc xin gợi ý từ cô giáo (ví dụ: con chịu, hổng biết, quên mất rồi, gợi ý đi cô).\n\n"
        "YÊU CẦU NGHIÊM NGẶT: Chỉ trả về đúng duy nhất 1 từ tiếng Anh in hoa: ANSWER / QUESTION / CONFIRM / CONFUSED. Không thêm bất cứ dấu câu hay từ ngữ nào khác."
    )
    
    result = await get_answer(
        user_message=prompt,
        system_prompt=system_prompt,
        history=[],
        temperature=0.0,
        max_tokens=10,
    )
    
    # 1. Làm sạch đầu ra bằng Regex (chỉ giữ ký tự chữ in hoa A-Z)
    word = re.sub(r'[^A-Z]', '', result.upper().strip())
    
    for intent in ("ANSWER", "QUESTION", "CONFIRM", "CONFUSED"):
        if intent in word:
            return intent
            
    # 2. Fallback thủ công thông minh cho ngôn từ đặc trưng của trẻ nhỏ Việt Nam
    user_lower = user_text.lower().strip()
    user_unsigned = _strip_accents(user_lower)
    
    # CONFUSED
    confused_keywords = [
        "khong biet", "hong biet", "chiu thoi", "con chiu", "be chiu",
        "quen roi", "quen mat", "quen tieu", "hong nho", "khong nho",
        "bi roi", "goi y", "chua nghi ra", "khong biet tra loi"
    ]
    if any(kw in user_unsigned for kw in confused_keywords):
        return "CONFUSED"
        
    # CONFIRM
    confirm_keywords = [
        "da", "vang", "da vang", "roi", "roi a", "da roi", "duoc a",
        "hieu roi", "da hieu", "con hieu", "be hieu", "da duoc"
    ]
    # Kiểm tra xem từ nói có nằm trong danh sách confirm hoặc bắt đầu bằng dạ/vâng
    if any(user_unsigned == kw or user_unsigned.startswith(kw + " ") for kw in confirm_keywords):
        return "CONFIRM"
        
    # QUESTION
    if "?" in user_lower or "tai sao" in user_unsigned or "la gi" in user_unsigned or "co oi" in user_unsigned or "vi sao" in user_unsigned:
        return "QUESTION"
        
    return "ANSWER"