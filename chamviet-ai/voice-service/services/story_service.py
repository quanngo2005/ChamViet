import asyncio
import json
import os
from typing import Dict, Optional

DEFAULT_STORY_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "story.json")
)

class StorySession:
    def __init__(self):
        self.question_index = 0
        self.completed = False
        self.story_data = None
        self.lock = asyncio.Lock()

class StorySessionManager:
    def __init__(self):
        self._sessions: Dict[str, StorySession] = {}
        self._lock = asyncio.Lock()

    async def get_or_create_session(self, session_id: str) -> StorySession:
        async with self._lock:
            if session_id not in self._sessions:
                self._sessions[session_id] = StorySession()
            return self._sessions[session_id]

    async def reset_session(self, session_id: str) -> StorySession:
        async with self._lock:
            self._sessions[session_id] = StorySession()
            return self._sessions[session_id]

def load_story_from_payload(story_title: str, qa_list: list[dict], child_age: int = 6) -> dict:
    cleaned_title = str(story_title or "").strip()
    if not cleaned_title:
        raise ValueError("story_title không được trống.")
    
    questions = []
    for idx, item in enumerate(qa_list, start=1):
        question = str(item.get("question") or "").strip()
        answer = str(item.get("answer") or "").strip()
        questions.append({
            "id": item.get("id", idx),
            "question": question,
            "answer": answer,
        })
    return {
        "story": cleaned_title,
        "questions": questions,
    }

def get_question(story: dict, question_index: int) -> Optional[dict]:
    questions = story["questions"]
    if 0 <= question_index < len(questions):
        return questions[question_index]
    return None

def build_question_text(story: dict, question: dict, question_index: int) -> str:
    return f"Tớ hỏi cậu câu số {question_index + 1} nhé. {question['question']}"
