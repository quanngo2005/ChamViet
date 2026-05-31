# Rate Limit Surface
> Public backend and AI endpoints that need throttling

Entry: `chamviet-api/src/main/java/com/vn/chamviet/chamviet_api/security/SecurityConfig.java` (L40-54)

Public Spring routes:
- Auth: `user/controller/AuthController.java` (L30-185) — login, register, refresh, activate, health
- Voice proxy: `AI/controller/VoiceAIController.java` (L37-73) — load-content, transcribe, chat, classify, speak, history, reset
- Vision proxy: `AI/controller/AIController.java` (L14-21) — `/api/v1/ai|vision/ai-connection`
- Public catalog/story: `product/controller/PublicProductController.java` (L16-36)

AI services:
- Voice FastAPI uses global prompt/session: `chamviet-ai/main.py` (L24, L52-68, L110-168)
- Vision FastAPI has process concurrency cap, not per-client rate limit: `chamviet-ai/vision-service/main.py` (L18, L40, L67-105)
- Docker publishes AI and vision ports: `docker-compose.yml` (L29-30, L52-53)

Current constraints:
- Upload cap: `chamviet-api/src/main/resources/application.properties` (L2-3) — 10MB
- Vision timeout: `chamviet-api/src/main/resources/application.properties` (L9) — 15s
- No Bucket4j/Resilience4j/Redis rate-limit dependency found in `chamviet-api/pom.xml`

Updated: 2026-05-29
