# Docker Service Wiring

## Summary

The root `chamviet-ai` FastAPI app is the voice AI service used by the backend. The `chamviet-ai/vision-service` FastAPI app is the vision service used by the backend. Docker Compose runs them as separate containers and overrides the backend properties with `AI_VOICE_BASE_URL=http://ai-service:8000` and `AI_VISION_BASE_URL=http://vision-service:5000`.

## Pointers

- `chamviet-api/src/main/java/com/vn/chamviet/chamviet_api/AI/service/VoiceAIService.java`: builds a WebClient from `ai.voice.base-url` and calls `/api/load-content`, `/api/transcribe`, `/api/chat`, `/api/classify`, `/api/speak`, `/api/history`, and `/api/reset`.
- `chamviet-api/src/main/java/com/vn/chamviet/chamviet_api/AI/service/AIService.java`: builds a WebClient from `ai.vision.base-url` and calls `/predict`.
- `chamviet-api/src/main/java/com/vn/chamviet/chamviet_api/AI/controller/AIController.java`: exposes the backend vision proxy at both `/api/v1/ai/ai-connection` for existing clients and `/api/v1/vision/ai-connection` for the clearer service name.
- `chamviet-ai/main.py`: exposes the matching FastAPI voice endpoints on port `8000`.
- `chamviet-ai/vision-service/main.py`: exposes the matching FastAPI vision endpoint on port `5000`.
- `chamviet-api/src/main/resources/application-dev.properties`: local database defaults use `jdbc:mysql://localhost:3306/chamviet`, root, password `1234`; Compose overrides these to use the `db` service name.
- `docker-compose.yml`: defines the root stack for `db`, `ai-service`, `vision-service`, and `backend`. The MySQL container listens on `3306` inside the Compose network and maps to host port `3307` by default to avoid conflicts with a local MySQL install.
