import asyncio
from typing import Dict, List
from config import MAX_HISTORY_TURNS


class Session:
    def __init__(self, system_prompt: str = ""):
        self.system_prompt: str = system_prompt
        self.history: List[dict] = []
        self.lock = asyncio.Lock()


class SessionManager:
    def __init__(self):
        self._sessions: Dict[str, Session] = {}
        self._lock = asyncio.Lock()

    async def get_or_create_session(self, session_id: str, default_system_prompt: str = "") -> Session:
        async with self._lock:
            if session_id not in self._sessions:
                self._sessions[session_id] = Session(default_system_prompt)
            return self._sessions[session_id]

    async def clear_session(self, session_id: str):
        async with self._lock:
            if session_id in self._sessions:
                del self._sessions[session_id]


def new_history() -> list:
    return []


def add_turn(history: list, user_msg: str, assistant_msg: str) -> list:
    history = history + [
        {"role": "user",      "content": user_msg},
        {"role": "assistant", "content": assistant_msg},
    ]
    max_msgs = MAX_HISTORY_TURNS * 2
    if len(history) > max_msgs:
        history = history[-max_msgs:]
    return history


def clear_history() -> list:
    return []


def format_for_display(history: list) -> list:
    return [{"role": h["role"], "content": h["content"]} for h in history]


def get_last_assistant(history: list) -> str:
    for turn in reversed(history):
        if turn["role"] == "assistant":
            return turn["content"]
    return ""