# Docker Service Wiring

## Summary

The `chamviet-ai/voice-service` FastAPI app is the voice AI service. The `chamviet-ai/vision-service` FastAPI app is the vision service. The root `docker-compose.yml` runs them as separate containers from their service directories.

## Pointers

- `chamviet-api/src/main/java/com/vn/chamviet/chamviet_api/AI/service/VoiceAIService.java`: builds a WebClient from `ai.voice.base-url` and calls `/api/load-content`, `/api/transcribe`, `/api/chat`, `/api/classify`, `/api/speak`, `/api/history`, and `/api/reset`.
- `chamviet-api/src/main/java/com/vn/chamviet/chamviet_api/AI/service/AIService.java`: builds a WebClient from `ai.vision.base-url` and calls `/predict`.
- `chamviet-api/src/main/java/com/vn/chamviet/chamviet_api/AI/controller/AIController.java`: exposes the backend vision proxy at both `/api/v1/ai/ai-connection` for existing clients and `/api/v1/vision/ai-connection` for the clearer service name.
- `chamviet-ai/voice-service/main.py`: exposes the matching FastAPI voice endpoints on port `8000`.
- `chamviet-ai/vision-service/main.py`: exposes the matching FastAPI vision endpoint on port `5000`.
- `chamviet-api/src/main/resources/application-dev.properties`: local database defaults use `jdbc:mysql://localhost:3306/chamviet`, root, password `1234`; Compose overrides these to use the `db` service name.
- `docker-compose.yml`: defines the root stack for `db`, `ai-service`, `vision-service`, and `backend`. The `ai-service` container uses the `chamviet-ai/voice-service` build context and `quanngo205/voice-service:latest` image. The MySQL container listens on `3306` inside the Compose network and maps to host port `3307` by default to avoid conflicts with a local MySQL install.
- `chamviet-ai/voice-service/Dockerfile`: preinstalls CPU-only `torch` from the PyTorch CPU wheel index before installing `sentence-transformers`; otherwise pip can pull CUDA-enabled PyTorch packages and create a multi-GB virtualenv layer.
- `chamviet-ai/voice-service/main.py`: has a root `/` system endpoint but no `/health` route, so the voice-service Docker healthcheck should target `/` or use a socket check.
- `chamviet-ai/voice-service/Dockerfile`: runtime cache directories under `/app/.cache` must be writable by `appuser` because Hugging Face and sentence-transformers use them at startup/runtime.

Updated: 2026-06-08
