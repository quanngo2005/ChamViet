def add_turn(history: list, question: str, answer: str) -> list:
    history.append({"role": "user",      "content": question})
    history.append({"role": "assistant", "content": answer})
    return history

def clear_history() -> list:
    return []

def format_for_display(history: list) -> list:
    """Chuyển history → [(user_msg, bot_msg), ...] để hiển thị UI."""
    pairs = []
    for i in range(0, len(history) - 1, 2):
        pairs.append((history[i]["content"], history[i+1]["content"]))
    return pairs
