from groq import Groq
from config import GROQ_API_KEY, WHISPER_MODEL

client = Groq(api_key=GROQ_API_KEY)

def transcribe_audio_file(file_path: str, language: str = "vi") -> str:
    with open(file_path, "rb") as f:
        result = client.audio.transcriptions.create(
            file=f,
            model=WHISPER_MODEL,
            language=language,
            temperature=0.0
        )
    return result.text
