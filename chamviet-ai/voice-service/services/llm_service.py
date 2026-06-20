import json
import random
import re
import threading
import unicodedata
from typing import Optional
from config import (
    GOOGLE_API_KEY, GEMINI_LLM_MODEL, GEMINI_FALLBACK_MODEL,
    GROQ_API_KEY, GROQ_LLM_MODEL, LLM_PROVIDER,
    LLM_DEFAULT_MAX_TOKENS, LLM_DEFAULT_TEMPERATURE,
    LLM_INTENT_MAX_TOKENS, LLM_INTENT_TEMPERATURE,
    LLM_JUDGE_MAX_TOKENS, LLM_JUDGE_TEMPERATURE,
    TTS_PERSONA_STYLE,
    EMBEDDING_ACCEPT_THRESHOLD, EMBEDDING_MODEL_NAME,
    EMBEDDING_REJECT_THRESHOLD,
    LLM_RETRY_ATTEMPTS, LLM_RETRY_BASE_DELAY,
)

_gemini_client = None
_groq_client = None
_async_groq_client = None
_embedding_model = None
_embedding_model_lock = threading.Lock()


def _get_gemini_client():
    global _gemini_client
    if _gemini_client is None:
        from google import genai
        _gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
    return _gemini_client


def _get_groq_client():
    global _groq_client
    if _groq_client is None:
        from groq import Groq
        _groq_client = Groq(api_key=GROQ_API_KEY)
    return _groq_client


def _get_async_groq_client():
    global _async_groq_client
    if _async_groq_client is None:
        from groq import AsyncGroq
        _async_groq_client = AsyncGroq(api_key=GROQ_API_KEY)
    return _async_groq_client


def _get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        with _embedding_model_lock:
            if _embedding_model is None:
                from sentence_transformers import SentenceTransformer
                _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    return _embedding_model


def _truncate_text_for_embedding(model, text: str) -> str:
    tokenizer = getattr(model, "tokenizer", None)
    if tokenizer is None:
        return text

    try:
        safe_max_length = max(32, min(int(getattr(model, "max_seq_length", 256) or 256), 256))
        encoded = tokenizer(
            text,
            add_special_tokens=True,
            truncation=True,
            max_length=safe_max_length,
            return_attention_mask=False,
            return_token_type_ids=False,
        )
        token_ids = encoded.get("input_ids") or []
        if not token_ids:
            return text

        truncated = tokenizer.decode(
            token_ids,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        ).strip()
        return truncated or text
    except Exception as exc:
        print(f"[EMBEDDING] Text truncation failed, using original text: {exc}")
        return text


def preload_embedding_model() -> str:
    """
    Load và warm-up embedding model trước khi bắt đầu hội thoại.
    """
    model = _get_embedding_model()
    model.encode(
        ["khởi động mô hình embedding"],
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return EMBEDDING_MODEL_NAME


async def preload_embedding_model_async() -> str:
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, preload_embedding_model)


def _build_messages(system_prompt: str, history: list, user_message: str) -> list:
    messages = [{"role": "system", "content": system_prompt}]
    messages += history
    messages.append({"role": "user", "content": user_message})
    return messages


def _history_to_gemini(history: list) -> list:
    """Convert OpenAI-style history to Gemini Content objects."""
    from google.genai import types
    contents = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))
    return contents


async def get_answer(
    user_message: str,
    system_prompt: str,
    history: list,
    temperature: float = LLM_DEFAULT_TEMPERATURE,
    max_tokens: int = LLM_DEFAULT_MAX_TOKENS,
) -> str:
    import asyncio
    attempts = LLM_RETRY_ATTEMPTS
    base_delay = LLM_RETRY_BASE_DELAY
    timeout = 15.0 if max_tokens <= LLM_INTENT_MAX_TOKENS else 30.0
    for attempt in range(1, attempts + 1):
        try:
            if LLM_PROVIDER == "groq":
                return await asyncio.wait_for(
                    _groq_answer_async(user_message, system_prompt, history, temperature, max_tokens),
                    timeout=timeout,
                )
            model = GEMINI_LLM_MODEL if attempt == 1 else GEMINI_FALLBACK_MODEL
            return await asyncio.wait_for(
                _gemini_answer_async(user_message, system_prompt, history, temperature, max_tokens, model),
                timeout=timeout,
            )
        except Exception as e:
            err_msg = str(e).upper()
            print(f"LLM async error ({LLM_PROVIDER}) attempt {attempt}: {e}")
            transient = any(code in err_msg for code in ["503", "429", "500", "502", "UNAVAILABLE", "RATE_LIMIT", "RESOURCE_EXHAUSTED", "HIGH DEMAND"])
            if attempt < attempts and transient:
                delay = base_delay * (2 ** (attempt - 1)) + random.uniform(0, 0.5)
                print(f"Retrying LLM in {delay:.2f}s...")
                await asyncio.sleep(delay)
                continue
            return ""
    return ""


async def _gemini_answer_async(user_message, system_prompt, history, temperature, max_tokens, model=None) -> str:
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        lambda: _gemini_answer_sync_inner(user_message, system_prompt, history, temperature, max_tokens, model)
    )


async def _groq_answer_async(user_message, system_prompt, history, temperature, max_tokens) -> str:
    client = _get_async_groq_client()
    response = await client.chat.completions.create(
        model=GROQ_LLM_MODEL,
        messages=_build_messages(system_prompt, history, user_message),
        temperature=temperature,
        max_tokens=max_tokens,
    )
    content = response.choices[0].message.content or ""
    return content.strip()


def get_answer_sync(
    user_message: str,
    system_prompt: str,
    history: list,
    temperature: float = LLM_DEFAULT_TEMPERATURE,
    max_tokens: int = LLM_DEFAULT_MAX_TOKENS,
) -> str:
    import time
    attempts = LLM_RETRY_ATTEMPTS
    base_delay = LLM_RETRY_BASE_DELAY
    for attempt in range(1, attempts + 1):
        try:
            if LLM_PROVIDER == "groq":
                return _groq_answer_sync_inner(user_message, system_prompt, history, temperature, max_tokens)
            model = GEMINI_LLM_MODEL if attempt == 1 else GEMINI_FALLBACK_MODEL
            return _gemini_answer_sync_inner(user_message, system_prompt, history, temperature, max_tokens, model)
        except Exception as e:
            err_msg = str(e).upper()
            print(f"LLM sync error ({LLM_PROVIDER}) attempt {attempt}: {e}")
            transient = any(code in err_msg for code in ["503", "429", "500", "502", "UNAVAILABLE", "RATE_LIMIT", "RESOURCE_EXHAUSTED", "HIGH DEMAND"])
            if attempt < attempts and transient:
                delay = base_delay * (2 ** (attempt - 1)) + random.uniform(0, 0.5)
                print(f"Retrying LLM in {delay:.2f}s...")
                time.sleep(delay)
                continue
            return ""
    return ""


def _gemini_answer_sync_inner(user_message, system_prompt, history, temperature, max_tokens, model=None) -> str:
    from google.genai import types
    client = _get_gemini_client()

    contents = _history_to_gemini(history)
    contents.append(types.Content(role="user", parts=[types.Part(text=user_message)]))

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=temperature,
        max_output_tokens=max_tokens,
    )
    response = client.models.generate_content(
        model=model or GEMINI_LLM_MODEL,
        contents=contents,
        config=config,
    )
    return (response.text or "").strip()


def _groq_answer_sync_inner(user_message, system_prompt, history, temperature, max_tokens) -> str:
    client = _get_groq_client()
    response = client.chat.completions.create(
        model=GROQ_LLM_MODEL,
        messages=_build_messages(system_prompt, history, user_message),
        temperature=temperature,
        max_tokens=max_tokens,
    )
    content = response.choices[0].message.content or ""
    return content.strip()


def _strip_accents(text: str) -> str:
    """Loại bỏ dấu tiếng Việt để so khớp từ khóa ổn định hơn."""
    normalized = unicodedata.normalize("NFD", text)
    without_marks = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
    return without_marks.replace("đ", "d").replace("Đ", "D")


def _normalize_text(text: str) -> str:
    text = _strip_accents(text.lower())
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


async def classify_intent(question: str, user_text: str, system_prompt: str) -> str:
    """
    Phân loại ý định của trẻ em bằng LLM và fallback từ khóa tiếng Việt.
    """
    prompt = (
        f'Bạn đồng hành hỏi bé: "{question}"\n'
        f'Bé nói: "{user_text}"\n\n'
        "Hãy phân loại phản hồi của bé thành một trong bốn nhóm ý định sau:\n"
        "- ANSWER: Bé đang cố gắng trả lời câu hỏi của tớ, dù đúng hay sai.\n"
        "- QUESTION: Bé đang hỏi ngược lại tớ hoặc thắc mắc về nội dung truyện.\n"
        "- CONFIRM: Bé đồng ý, xác nhận đã hiểu hoặc đã nghe rõ.\n"
        "- CONFUSED: Bé không biết, không nhớ, hoặc xin tớ gợi ý.\n\n"
        "Chỉ trả về đúng duy nhất 1 từ tiếng Anh in hoa: ANSWER / QUESTION / CONFIRM / CONFUSED."
    )

    result = await get_answer(
        user_message=prompt,
        system_prompt=system_prompt,
        history=[],
        temperature=LLM_INTENT_TEMPERATURE,
        max_tokens=LLM_INTENT_MAX_TOKENS,
    )

    word = re.sub(r"[^A-Z]", "", result.upper().strip())
    for intent in ("ANSWER", "QUESTION", "CONFIRM", "CONFUSED"):
        if intent in word:
            return intent

    user_unsigned = _normalize_text(user_text)

    confused_keywords = [
        "khong biet", "hong biet", "khong nho", "hong nho", "cau chiu",
        "be chiu", "quen roi", "quen mat", "goi y", "chua nghi ra",
    ]
    if any(kw in user_unsigned for kw in confused_keywords):
        return "CONFUSED"

    confirm_keywords = [
        "da", "vang", "da vang", "roi", "roi a", "da roi", "duoc a",
        "hieu roi", "da hieu", "cau hieu", "be hieu",
    ]
    if any(user_unsigned == kw or user_unsigned.startswith(kw + " ") for kw in confirm_keywords):
        return "CONFIRM"

    question_keywords = ["tai sao", "la gi", "ban oi", "minh oi", "vi sao", "nhu the nao", "o dau"]
    if "?" in user_text or any(kw in user_unsigned for kw in question_keywords):
        return "QUESTION"

    return "ANSWER"


def _extract_json_object(text: str) -> dict:
    match = re.search(r"\{.*\}", text.strip(), flags=re.DOTALL)
    if not match:
        return {}
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return {}


def _coerce_score(value) -> float:
    try:
        score = float(value)
    except (TypeError, ValueError):
        return 0.0
    return max(0.0, min(100.0, score))


def _coerce_bool(value) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"true", "1", "yes", "đúng", "dung"}
    return bool(value)


def _embedding_cosine_similarity_sync(text_a: str, text_b: str) -> Optional[float]:
    model = _get_embedding_model()
    prepared_a = _truncate_text_for_embedding(model, text_a)
    prepared_b = _truncate_text_for_embedding(model, text_b)

    try:
        embeddings = model.encode(
            [prepared_a, prepared_b],
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=False,
        )
        return float(embeddings[0] @ embeddings[1])
    except Exception as exc:
        print(f"[EMBEDDING] Similarity scoring failed, falling back to LLM judge: {exc}")
        return None


async def _embedding_cosine_similarity(text_a: str, text_b: str) -> Optional[float]:
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        lambda: _embedding_cosine_similarity_sync(text_a, text_b),
    )


def _fallback_feedback(is_correct: bool, correct_answer: str, question: str = "", user_answer: str = "") -> str:
    correct_answer = correct_answer.strip()
    if is_correct:
        praise_templates = [
            "Giỏi quá, cậu trả lời đúng rồi!",
            "Chuẩn luôn, cậu nhớ truyện tốt quá!",
            "Chính xác! Cậu giỏi lắm.",
            "Đúng rồi cậu ơi, xuất sắc!",
        ]
        return random.choice(praise_templates)

    correction_templates = [
        f"Chưa đúng lắm. Đáp án đúng là: {correct_answer}",
        f"Gần đúng rồi. Ý đúng là: {correct_answer}",
        f"Không sao, tớ giúp cậu nhớ lại nhé: {correct_answer}",
        f"Cậu cố gắng rồi, chi tiết đúng là: {correct_answer}",
    ]
    return random.choice(correction_templates)


def _fast_feedback(
    is_correct: bool,
    correct_answer: str,
    question: str = "",
    user_answer: str = "",
    reason: str = "",
) -> str:
    correct_answer = correct_answer.strip()
    reason = _normalize_companion_pronouns((reason or "").strip())

    if is_correct:
        quick_praise_templates = [
            "Đúng rồi cậu!",
            "Giỏi quá, cậu trả lời đúng rồi!",
            "Chuẩn luôn cậu!",
        ]
        if reason:
            return f"{random.choice(quick_praise_templates)} {reason}"
        return random.choice(quick_praise_templates)

    quick_retry_templates = [
        "Chưa đúng lắm cậu ơi.",
        "Không sao đâu.",
        "Cậu cố gắng rồi.",
    ]
    if reason:
        return f"{random.choice(quick_retry_templates)} {reason} Đáp án là: {correct_answer}"
    return f"{random.choice(quick_retry_templates)} Đáp án là: {correct_answer}"


def _has_enough_feedback_detail(feedback: str, is_correct: bool, correct_answer: str) -> bool:
    feedback = feedback.strip()
    min_words = 5 if is_correct else 10
    if len(re.findall(r"\w+", feedback, flags=re.UNICODE)) < min_words:
        return False

    incomplete_endings = (
        "cố gắng", "cố gắng.", "thử lại", "thử lại.", "đúng rồi", "đúng rồi.",
        "giỏi lắm", "giỏi lắm.", "rất tốt", "rất tốt.",
    )
    return not any(feedback.lower().strip().endswith(ending) for ending in incomplete_endings)


def _ensure_clear_feedback(
    feedback: str,
    is_correct: bool,
    correct_answer: str,
    question: str,
    user_answer: str,
) -> str:
    if _has_enough_feedback_detail(feedback, is_correct, correct_answer):
        return _normalize_companion_pronouns(feedback.strip())
    return _fallback_feedback(is_correct, correct_answer, question=question, user_answer=user_answer)


def _normalize_companion_pronouns(text: str) -> str:
    replacements = {
        "Chúng mình": "Tớ và cậu",
        "chúng mình": "tớ và cậu",
        "Mình": "Tớ",
        "mình": "tớ",
        "Con": "Cậu",
        "con": "cậu",
        "Cô": "Tớ",
        "cô": "tớ",
    }
    for old, new in replacements.items():
        text = re.sub(rf"\b{re.escape(old)}\b", new, text)
    return text


def _normalize_evaluation_data(data: dict) -> dict:
    score = _coerce_score(data.get("score"))
    is_correct = _coerce_bool(data.get("is_correct"))
    feedback = str(data.get("feedback") or "").strip()
    reason = str(data.get("reason") or "").strip()
    return {
        "score": score,
        "is_correct": is_correct,
        "feedback": feedback,
        "reason": reason,
    }


async def _judge_story_answer(
    question: str,
    correct_answer: str,
    user_answer: str,
    story_title: str = "",
) -> dict:
    prompt = (
        "Chấm câu trả lời của bé 6 đến 9 tuổi theo Ý LÕI, không bắt khớp văn mẫu.\n"
        f"Truyện: {story_title}\n"
        f"Câu hỏi: {question}\n"
        f"Đáp án mẫu: {correct_answer}\n"
        f"Bé trả lời: {user_answer}\n"
        "Các câu trả lời của bé có thể rất ngắn, thiếu chủ vị, dùng từ đồng nghĩa, thiếu dấu, hoặc chỉ có vài từ khóa. "
        "Hãy rút ý lõi từ đáp án mẫu và xem bé có nói đúng ý chính hay không.\n"
        "Đúng nếu câu trả lời giữ được ý chính/cốt lõi của đáp án, dù diễn đạt chưa trọn câu. "
        "Sai nếu bé nhầm sự kiện chính, mâu thuẫn với đáp án, quá mơ hồ, nói không biết, hoặc lạc đề.\n"
        "score là mức độ đầy đủ 0-100, không phải ngưỡng quyết định cứng.\n"
        "reason phải cực kỳ ngắn gọn, tối đa 6 từ, chỉ rõ ý chính đúng hoặc sai. "
        "Không tạo feedback dài vì hệ thống sẽ tự tạo feedback để đọc TTS.\n"
        "Chỉ trả JSON hợp lệ, không markdown, không giải thích ngoài JSON, gồm đúng 3 trường:\n"
        '{"score": 0-100, "is_correct": true/false, "reason": "lý do rất ngắn"}'
    )

    system_prompt = (
        "Bạn là bộ chấm nhanh câu trả lời truyện cho trẻ 6 đến 9 tuổi. "
        "Nhiệm vụ duy nhất: quyết định đúng/sai theo ý nghĩa cốt lõi và trả JSON cực ngắn. "
        "Không viết feedback dài, không giải thích dài dòng. "
        "Luôn trả về JSON chuẩn với đúng 3 trường: score, is_correct, reason."
    )

    result = await get_answer(
        user_message=prompt,
        system_prompt=system_prompt,
        history=[],
        temperature=LLM_JUDGE_TEMPERATURE,
        max_tokens=LLM_JUDGE_MAX_TOKENS,
    )
    return _extract_json_object(result)


async def evaluate_story_answer(
    question: str,
    correct_answer: str,
    user_answer: str,
    story_title: str = "",
) -> dict:
    """
    Chấm câu trả lời theo flow:
    embedding cosine local -> auto-pass khi rất giống
    -> auto-reject khi rất khác và có tín hiệu không biết/lạc đề
    -> LLM judge chỉ cho vùng mơ hồ còn lại.
    """
    user_answer = user_answer.strip()
    if not user_answer:
        return {
            "score": 0.0,
            "is_correct": False,
            "embedding_score": 0.0,
            "judge_source": "empty_answer",
            "feedback": "Tớ chưa nghe rõ câu trả lời của cậu. Tớ nhắc lại nhẹ nhàng nhé: "
            f"{correct_answer}",
            "reason": "empty_answer",
        }

    embedding_score = await _embedding_cosine_similarity(user_answer, correct_answer)
    embedding_available = embedding_score is not None
    embedding_percent = (
        round(max(0.0, min(1.0, embedding_score)) * 100.0, 1)
        if embedding_available
        else 0.0
    )

    if embedding_available and embedding_score >= EMBEDDING_ACCEPT_THRESHOLD:
        return {
            "score": embedding_percent,
            "is_correct": True,
            "embedding_score": embedding_score,
            "judge_source": "embedding_accept",
            "feedback": _fast_feedback(
                True,
                correct_answer,
                question=question,
                user_answer=user_answer,
                reason="Cậu nhớ đúng ý chính rồi.",
            ),
            "reason": "embedding_similarity_high",
        }

    user_answer_normalized = _normalize_text(user_answer)
    obvious_incorrect_phrases = (
        "khong biet",
        "hong biet",
        "khong nho",
        "hong nho",
        "quen roi",
        "quen mat",
        "khong nghe ro",
        "chua biet",
    )
    if embedding_available and embedding_score <= EMBEDDING_REJECT_THRESHOLD and any(
        phrase in user_answer_normalized for phrase in obvious_incorrect_phrases
    ):
        return {
            "score": embedding_percent,
            "is_correct": False,
            "embedding_score": embedding_score,
            "judge_source": "embedding_reject",
            "feedback": _fast_feedback(
                False,
                correct_answer,
                question=question,
                user_answer=user_answer,
                reason="Câu trả lời này chưa đúng ý truyện.",
            ),
            "reason": "embedding_similarity_low",
        }

    raw_data = await _judge_story_answer(
        question=question,
        correct_answer=correct_answer,
        user_answer=user_answer,
        story_title=story_title,
    )

    data = _normalize_evaluation_data(raw_data) if raw_data else {}
    if not data:
        return {
            "score": embedding_percent,
            "is_correct": False,
            "embedding_score": embedding_score if embedding_available else 0.0,
            "judge_source": "embedding_failed_llm_parse_failed" if not embedding_available else "llm_parse_failed",
            "feedback": _fallback_feedback(
                False,
                correct_answer=correct_answer,
                question=question,
                user_answer=user_answer,
            ),
            "reason": "llm_json_parse_failed",
        }

    score = data["score"]
    is_correct = data["is_correct"]
    reason = data["reason"]

    feedback = _fast_feedback(
        is_correct,
        correct_answer=correct_answer,
        question=question,
        user_answer=user_answer,
        reason=reason,
    )

    return {
        "score": score,
        "is_correct": is_correct,
        "embedding_score": embedding_score if embedding_available else 0.0,
        "judge_source": "embedding_failed_llm_judge" if not embedding_available else "llm_judge",
        "feedback": feedback,
        "reason": reason,
    }
