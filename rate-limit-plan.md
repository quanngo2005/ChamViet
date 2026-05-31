# Ke Hoach Xay Dung He Thong Rate Limit Cho ChamViet

## 1. Muc Tieu

He thong ChamViet hien co cac endpoint public cho auth, public content, voice AI va vision AI. Muc tieu cua rate limit la:

- Bao ve tai nguyen ton kem: YOLO vision inference, STT, LLM, TTS.
- Giam rui ro brute force login va spam register/email activation.
- Ngan client bug hoac retry loop lam qua tai backend/AI service.
- Giu trai nghiem nguoi dung on dinh, khong chan nham flow hop le cua UI.
- Tao nen tang de mo rong quota theo IP, user, session hoac subscription sau nay.

## 2. Hien Trang Codebase

### 2.1 Backend Spring Boot

Entry point chinh: `chamviet-api`.

Security config hien dang `permitAll` cho:

- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/refresh-token`
- `/api/auth/health`
- `/api/auth/activate`
- `/api/public/**`
- `/api/v1/voice/**`
- `/api/v1/ai/**`
- `/api/v1/vision/**`

Tham chieu: `chamviet-api/src/main/java/com/vn/chamviet/chamviet_api/security/SecurityConfig.java`

### 2.2 AI Voice Service

Service Python/FastAPI tai `chamviet-ai/main.py` expose:

- `POST /api/load-content`
- `POST /api/reset`
- `POST /api/transcribe`
- `POST /api/speak`
- `POST /api/chat`
- `POST /api/classify`
- `GET /api/history`

Rui ro dang chu y:

- Dung `GLOBAL_SYSTEM_PROMPT` va default session, nen `load-content/reset` co the anh huong flow cua user khac neu service dung chung.
- CORS dang `allow_origins=["*"]`.
- Chua co rate limit theo IP/session/user.

### 2.3 Vision Service

Service Python/FastAPI tai `chamviet-ai/vision-service/main.py` expose:

- `GET /health`
- `POST /predict`

Da co gioi han:

- `MAX_UPLOAD_BYTES`, mac dinh 10MB.
- `MAX_CONCURRENT_PREDICTIONS`, mac dinh 2.

Chua co:

- Rate limit theo IP/user/session.
- Queue timeout theo client.
- Quota rieng cho public scan.

### 2.4 Docker Compose

`docker-compose.yml` dang publish truc tiep:

- AI voice service: `${AI_SERVICE_PORT:-8000}:8000`
- Vision service: `${VISION_SERVICE_PORT:-5000}:5000`
- Backend: `${BACKEND_PORT:-8081}:8081`

Rui ro: neu moi truong production mo cac port 8000/5000 ra internet, attacker co the bypass backend va goi thang AI services, khien rate limit o Spring Boot khong con tac dung.

## 3. Nguyen Tac Thiet Ke

- Rate limit nen dat tai "cua truoc" cua he thong: Spring Boot backend.
- Khong chi limit theo path; can limit theo nhom hanh vi: auth, vision, voice STT, voice LLM, voice TTS, public read.
- Can co nhieu identity key: IP, user id, email, session id.
- Endpoint ton tien/tai nguyen phai co quota chat hon endpoint doc public.
- Tra loi bi limit phai dung HTTP `429 Too Many Requests`.
- Nen co header de client biet cach retry: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
- Rate limit khong thay the authentication, authorization, validation, upload limit hay concurrency limit.
- Production nen co nhieu lop: edge/gateway limit, app-level limit, service-local guard.

## 4. Priority Endpoint Can Rate Limit

### P0 - Bat Buoc Lam Truoc

| Nhom | Endpoint | Ly do | De xuat ban dau |
|---|---|---|---|
| Vision scan | `/api/v1/vision/ai-connection`, `/api/v1/ai/ai-connection` | Upload file + YOLO inference, ton CPU/GPU | `5 req/phut/IP`, burst `2`, concurrency `1/IP` |
| Voice STT | `/api/v1/voice/transcribe` | Upload audio + STT, de ton external API/tai nguyen | `10 req/phut/IP`, `30 req/10 phut/session` |
| Voice LLM | `/api/v1/voice/chat`, `/api/v1/voice/classify` | Goi LLM, ton quota va latency cao | `20-30 req/phut/session`, `60 req/gio/IP` |
| Voice TTS | `/api/v1/voice/speak` | TTS ton external API neu cache miss | `60 req/phut/session`, `200 req/gio/IP` |
| Voice state | `/api/v1/voice/load-content`, `/api/v1/voice/reset` | Co the thay doi global prompt/session cua AI service | `5 req/phut/session`, `20 req/gio/IP` |

### P1 - Bao Ve Tai Khoan Va Token

| Nhom | Endpoint | Ly do | De xuat ban dau |
|---|---|---|---|
| Login | `/api/auth/login` | Brute force password | `5 req/phut/IP`, `10 req/15 phut/email` |
| Register | `/api/auth/register` | Spam account/email activation | `3 req/gio/IP`, `5 req/ngay/email/domain` |
| Refresh token | `/api/auth/refresh-token` | Token abuse hoac client retry loop | `30 req/phut/user`, `60 req/phut/IP` |
| Activate | `/api/auth/activate` | Token guessing/scanning | `20 req/phut/IP`, them validation token format |

### P2 - Public Read Va Content

| Nhom | Endpoint | Ly do | De xuat ban dau |
|---|---|---|---|
| Product detail | `/api/public/products/{productId}` | DB read, co the scrape | `120-300 req/phut/IP`, cache response |
| Story config | `/api/public/puzzle-stories/video/{videoId}` | DB read dung trong flow video | `120-300 req/phut/IP`, cache response |

### P3 - Low Risk / Infra

| Nhom | Endpoint | De xuat |
|---|---|---|
| Health | `/api/auth/health`, `/health` | Limit rong `60-120 req/phut/IP` hoac chi expose noi bo |
| Swagger/OpenAPI | `/swagger-ui/**`, `/v3/api-docs/**` | Tat hoac auth trong production; neu mo thi limit `30 req/phut/IP` |

## 5. Cac Phuong An Kien Truc

## Phuong An A - In-Memory Rate Limit Trong Spring Boot

### Mo Ta

Them mot `OncePerRequestFilter` trong `chamviet-api` de chan request truoc khi vao controller. Filter se:

1. Xac dinh request thuoc rate limit group nao.
2. Xac dinh identity key: IP, user id, email, session id.
3. Consume token tu in-memory bucket.
4. Neu het token, tra `429 Too Many Requests`.

Thu vien co the dung:

- Bucket4j + Caffeine/in-memory cache.
- Hoac tu viet token bucket don gian bang `ConcurrentHashMap`, nhung khong khuyen nghi neu can chuan xac va bao tri lau dai.

### Thanh Phan De Xuat

- `RateLimitFilter`: filter chinh.
- `RateLimitPolicy`: mapping route group -> limit config.
- `ClientIdentityResolver`: lay IP, user id tu JWT, email tu body login/register.
- `RateLimitResponseWriter`: render response 429 thong nhat.
- `RateLimitProperties`: cau hinh tu `application.properties`.

### Trade-Off

Uu diem:

- Nhanh nhat de trien khai.
- Khong can them Redis hay ha tang moi.
- Phu hop giai doan MVP/demo.
- De test bang unit/integration test.

Nhuoc diem:

- Restart backend la mat bucket.
- Neu scale nhieu backend instance, moi instance co quota rieng, user co the vuot limit tong bang cach di qua instance khac.
- Khong chia se quota voi AI service neu AI service bi goi truc tiep.
- Memory co the tang neu co nhieu IP/key rac, can eviction TTL.

Khi nen chon:

- He thong chay 1 instance backend.
- Can giam rui ro nhanh trong 1 sprint.
- Chua co Redis.

Khi khong nen chon:

- Production co autoscaling.
- Can quota chinh xac theo user/IP tren nhieu node.
- Can audit/observability manh.

## Phuong An B - Redis-Backed Rate Limit Trong Spring Boot

### Mo Ta

Van dat rate limit tai Spring Boot, nhung state bucket/counter nam trong Redis. Moi backend instance dung chung Redis nen quota nhat quan.

Thu vien co the dung:

- Bucket4j Redis extension.
- Redis Lua script tu viet cho fixed window/sliding window/token bucket.
- Spring Data Redis + Lua script.

### Thanh Phan De Xuat

- Them service `redis` vao `docker-compose.yml`.
- Them dependency Redis vao `chamviet-api/pom.xml`.
- `RateLimitFilter` consume token tu Redis.
- `RateLimitPolicy` cau hinh theo properties.
- Metrics/logging cho request bi limit.

### Key Design

| Nhom | Key chinh | Key phu |
|---|---|---|
| Login | `rl:ip:{ip}:auth-login` | `rl:email:{email}:auth-login` |
| Register | `rl:ip:{ip}:auth-register` | `rl:email:{email}:auth-register` |
| Refresh | `rl:user:{userId}:auth-refresh` | `rl:ip:{ip}:auth-refresh` |
| Vision | `rl:ip:{ip}:vision-scan` | `rl:user:{userId}:vision-scan` neu co auth |
| Voice STT | `rl:session:{sessionId}:voice-stt` | `rl:ip:{ip}:voice-stt` |
| Voice LLM | `rl:session:{sessionId}:voice-llm` | `rl:ip:{ip}:voice-llm` |
| Voice TTS | `rl:session:{sessionId}:voice-tts` | `rl:ip:{ip}:voice-tts` |
| Public read | `rl:ip:{ip}:public-read` | optional route-specific key |

### Trade-Off

Uu diem:

- Phu hop production va multi-instance.
- Quota chinh xac hon in-memory.
- Restart backend khong mat state.
- De mo rong sang plan theo user/subscription.
- Co the inspect key khi debug.

Nhuoc diem:

- Can them Redis, monitoring, backup/ops.
- Tang latency moi request mot chut.
- Can quyet dinh khi Redis loi:
  - Fail-open: cho request di qua, uu tien availability nhung giam bao ve.
  - Fail-closed: chan request, uu tien bao ve nhung co the lam outage.
- Can thiet ke TTL/cleanup tot de tranh Redis phinh key.

Khi nen chon:

- Production hoac staging nghiem tuc.
- Backend co the scale ngang.
- AI calls ton chi phi.

Khi khong nen chon:

- Demo cuc nho, chua co ha tang Redis.
- Team chua san sang van hanh Redis.

## Phuong An C - Edge/Gateway Rate Limit

### Mo Ta

Dat Nginx, Cloudflare, API Gateway hoac reverse proxy truoc backend. Gateway limit request truoc khi vao Spring Boot.

### Nen Dung De

- Limit thô theo IP.
- Chan burst/DDoS.
- Chan request body qua lon.
- Chan direct access den Swagger/OpenAPI production.
- Chi cho public internet vao backend, khong vao AI services.

### Trade-Off

Uu diem:

- Chan som, giam tai cho backend.
- Tot cho traffic spike.
- Cau hinh body size, timeout, concurrent connection hieu qua.
- Co the ap dung ma khong sua app qua nhieu.

Nhuoc diem:

- Khong hieu email/user/session sau login neu khong tich hop sau.
- Khong thay the app-level auth/login limit theo email.
- Local/dev va production co the khac nhau, de sinh config drift.
- Neu chi dung gateway, internal retry/client bug trong mang noi bo van co the qua tai service.

Khi nen chon:

- Production public internet.
- Can bao ve truoc cac endpoint upload/AI.
- Da co Nginx/Cloudflare/API Gateway.

Khi khong nen chon:

- Can limit chinh xac theo user/email/session.
- He thong chua co reverse proxy.

## Phuong An D - Service-Local Rate Limit Trong FastAPI AI Services

### Mo Ta

Them middleware rate limit truc tiep trong `chamviet-ai` va `vision-service`.

Co the dung:

- `slowapi`/`limits` cho FastAPI.
- Redis-backed limiter neu can multi-instance.
- Middleware tu viet don gian cho per-IP token bucket.

### Nen Dung De

- Bao ve AI service neu bi goi truc tiep.
- Defense-in-depth neu backend/gateway loi.
- Gioi han endpoint dat tien: `/api/transcribe`, `/api/chat`, `/api/classify`, `/api/speak`, `/predict`.

### Trade-Off

Uu diem:

- Bao ve sat tai nguyen ton kem.
- Van co tac dung neu traffic bypass backend.
- Co the ket hop voi concurrency cap san co trong vision service.

Nhuoc diem:

- Duplicate policy voi Spring Boot.
- AI service kho biet user thật neu chi nhin IP container/proxy.
- Neu service dung sau backend, IP co the la backend IP tru khi forward header dung cach.
- Khong bao ve auth/register/public API.

Khi nen chon:

- AI service co kha nang bi expose truc tiep.
- Can lop phong thu cuoi.
- Vision/voice service co duoc deploy doc lap.

Khi khong nen chon:

- Muon mot noi duy nhat quan ly policy.
- Chua giai quyet duoc trusted proxy/header.

## 6. Khuyen Nghi Chon Phuong An

Khuyen nghi theo giai doan:

1. Ngan bypass truoc: khong publish AI service va vision service ra internet.
2. Lam MVP app-level rate limit trong Spring Boot bang in-memory Bucket4j.
3. Khi chuan bi production, doi state store sang Redis.
4. Them edge/gateway rate limit cho upload/AI endpoints.
5. Them service-local guard trong FastAPI neu AI service co nguy co duoc goi truc tiep hoac deploy rieng.

Phuong an can bang nhat:

- Short term: Phuong an A + khoa port AI.
- Production: Phuong an B + C.
- Defense-in-depth: them D cho AI services.

## 7. Ke Hoach Trien Khai Chi Tiet

## Phase 0 - Hardening Network

Muc tieu: dam bao traffic AI di qua backend.

Viec can lam:

- Trong `docker-compose.yml`, khong publish `ai-service` va `vision-service` ports o production.
- Neu can debug local, chi bind vao localhost:
  - `127.0.0.1:${AI_SERVICE_PORT:-8000}:8000`
  - `127.0.0.1:${VISION_SERVICE_PORT:-5000}:5000`
- Backend van goi noi bo qua:
  - `AI_VOICE_BASE_URL=http://ai-service:8000`
  - `AI_VISION_BASE_URL=http://vision-service:5000`

Trade-off:

- Bao mat hon, giam bypass.
- Dev muon goi AI truc tiep se can port local hoac profile dev rieng.

Acceptance criteria:

- Tu ngoai network production khong goi duoc port 8000/5000.
- UI van scan/voice duoc qua backend.

## Phase 1 - MVP Rate Limit In-Memory Trong Spring Boot

Muc tieu: bao ve P0/P1 nhanh.

Viec can lam:

- Them dependency Bucket4j va Caffeine neu dung cache eviction.
- Tao `RateLimitFilter`.
- Tao route group:
  - `AUTH_LOGIN`
  - `AUTH_REGISTER`
  - `AUTH_REFRESH`
  - `VISION_SCAN`
  - `VOICE_STT`
  - `VOICE_LLM`
  - `VOICE_TTS`
  - `VOICE_STATE`
  - `PUBLIC_READ`
- Implement identity resolver:
  - Neu co JWT hop le: user id/email.
  - Neu login/register: parse email tu body voi request wrapper.
  - Fallback: client IP.
  - Neu co reverse proxy: chi tin `X-Forwarded-For` khi request tu trusted proxy.
- Tra response `429` thong nhat.
- Them log structured khi bi limit.

Trade-off:

- Nhanh, it ha tang.
- Chua phu hop scale nhieu backend.
- Parse body trong filter can can than de khong lam controller mat request body. Can dung `ContentCachingRequestWrapper` hoac chi dung IP cho MVP auth truoc.

Acceptance criteria:

- Vuot limit `/api/v1/vision/ai-connection` nhan `429`.
- Vuot limit `/api/auth/login` nhan `429`.
- Response co `Retry-After`.
- Request duoi limit van di qua binh thuong.
- Unit/integration test pass.

## Phase 2 - Redis Rate Limit

Muc tieu: production-ready cho multi-instance.

Viec can lam:

- Them Redis vao `docker-compose.yml`.
- Them cau hinh:
  - `spring.data.redis.host`
  - `spring.data.redis.port`
  - `rate-limit.redis.enabled=true`
- Chuyen bucket state tu in-memory sang Redis.
- Them health/metrics cho Redis limiter.
- Chon fallback:
  - De xuat: fail-open cho `PUBLIC_READ`, fail-closed hoac degraded limit cho `AI` va `AUTH`.

Trade-off:

- Chinh xac va scale tot hon.
- Tang complexity va latency.
- Redis outage tro thanh dependency quan trong.

Acceptance criteria:

- Hai backend instance dung chung quota.
- Restart backend khong reset quota.
- Redis key co TTL.
- Co test/fallback khi Redis unavailable.

## Phase 3 - Gateway/Edge Limit

Muc tieu: chan burst lon truoc backend.

Viec can lam:

- Neu dung Nginx:
  - Limit `/api/v1/vision/**` theo IP.
  - Limit `/api/v1/voice/**` theo IP.
  - Set `client_max_body_size 10m`.
  - Set request timeout hop ly cho AI calls.
- Neu dung Cloudflare/API Gateway:
  - Tao rule theo path.
  - Bat bot protection neu co.
  - Rate limit upload endpoints chat hon read endpoints.

Trade-off:

- Giam tai backend som.
- Chua hieu user/email/session.
- Can dong bo config giua app va gateway de tranh chan nham.

Acceptance criteria:

- Burst traffic bi chan o gateway.
- Backend log giam request spam.
- Normal UI flow khong bi anh huong.

## Phase 4 - AI Service-Local Guard

Muc tieu: lop bao ve cuoi cho FastAPI.

Viec can lam:

- Them middleware limiter cho `chamviet-ai/main.py`.
- Them middleware limiter cho `chamviet-ai/vision-service/main.py`.
- Chi doc real client IP tu trusted proxy header.
- Giu `MAX_CONCURRENT_PREDICTIONS` cho vision va them queue timeout neu can.

Trade-off:

- Bao ve sat tai nguyen AI.
- Them duplicate policy.
- Can thiet ke header trust dung de khong bi spoof IP.

Acceptance criteria:

- Goi truc tiep AI service qua noi bo van bi limit neu spam.
- Vision concurrency cap van hoat dong.
- Backend request hop le khong bi chan nham.

## 8. Cau Hinh De Xuat Ban Dau

```properties
# Enable/disable
rate-limit.enabled=true
rate-limit.backend=in-memory

# Default
rate-limit.default.capacity=120
rate-limit.default.refill-tokens=120
rate-limit.default.refill-period=60s

# Auth
rate-limit.auth-login.ip.capacity=5
rate-limit.auth-login.ip.refill-period=60s
rate-limit.auth-login.email.capacity=10
rate-limit.auth-login.email.refill-period=15m

rate-limit.auth-register.ip.capacity=3
rate-limit.auth-register.ip.refill-period=1h

rate-limit.auth-refresh.user.capacity=30
rate-limit.auth-refresh.user.refill-period=60s

# Vision
rate-limit.vision-scan.ip.capacity=5
rate-limit.vision-scan.ip.refill-period=60s
rate-limit.vision-scan.ip.burst=2

# Voice
rate-limit.voice-stt.ip.capacity=10
rate-limit.voice-stt.ip.refill-period=60s

rate-limit.voice-llm.session.capacity=30
rate-limit.voice-llm.session.refill-period=60s

rate-limit.voice-tts.session.capacity=60
rate-limit.voice-tts.session.refill-period=60s

rate-limit.voice-state.session.capacity=5
rate-limit.voice-state.session.refill-period=60s

# Public read
rate-limit.public-read.ip.capacity=300
rate-limit.public-read.ip.refill-period=60s
```

Can dieu chinh sau khi co metrics thuc te.

## 9. Response 429 Chuan

Vi du:

```json
{
  "success": false,
  "message": "Too many requests",
  "error": "Rate limit exceeded for VOICE_STT",
  "statusCode": 429,
  "retryAfterSeconds": 30
}
```

Headers:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1716960000
```

Trade-off:

- Response ro rang giup UI retry tot hon.
- Khong nen expose qua nhieu thong tin noi bo ve policy neu lo ngai attacker tune request.

## 10. UI/Client Considerations

UI hien co flow voice prewarm TTS cache trong `chamviet-ui/src/hooks/useVoiceAi.ts`. Neu limit `/speak` qua chat, user co the bi 429 ngay khi vao story.

Can lam:

- TTS `/speak` co limit rieng, rong hon `/chat` va `/transcribe`.
- Client nen handle `429`:
  - Hien thong bao than thien.
  - Dung `Retry-After` de cho phep thu lai.
  - Khong retry lien tuc khi gap 429.
- Neu lam nang cao: backend phan biet TTS cache hit/cache miss. Cache hit co limit rong hon, cache miss chat hon.

Trade-off:

- Limit chat bao ve cost tot hon nhung de pha UX.
- Limit rong hon giu UX tot nhung co nguy co ton TTS neu cache miss nhieu.

## 11. Observability

Can log/metric toi thieu:

- Tong request bi 429 theo group.
- Top IP/user/session bi limit.
- Ty le 429 tren tong request.
- Latency cua Redis limiter neu dung Redis.
- AI call latency va error rate.
- Vision queue/concurrency usage.

Metric de xuat:

- `rate_limit_allowed_total{group=...}`
- `rate_limit_blocked_total{group=...}`
- `rate_limit_remaining_tokens{group=...}`
- `ai_voice_requests_total{endpoint=...}`
- `ai_vision_predictions_total`
- `ai_vision_prediction_duration_ms`

Trade-off:

- Observability giup tuning chinh xac.
- Them metric/log co the tang noise va can dashboard.

## 12. Test Plan

### Unit Test

- Route matcher map dung endpoint -> group.
- Identity resolver lay dung IP/user/email/session.
- Bucket consume dung va block khi het quota.
- Response writer tra dung status/header/body.

### Integration Test

- Goi `/api/auth/login` qua limit -> lan tiep theo tra 429.
- Goi `/api/v1/vision/ai-connection` qua limit -> tra 429 truoc khi vao controller.
- Goi public read duoi limit -> 200.
- Neu co JWT, quota user tach voi IP fallback.

### Load/Manual Test

- Dung script spam endpoint P0.
- Xac minh AI service khong bi goi khi backend da tra 429.
- Xac minh UI voice flow binh thuong khong bi chan nham.
- Xac minh `Retry-After` dung.

Trade-off:

- Test filter voi multipart/body wrapper mat cong hon.
- Nen uu tien test P0/P1 truoc, P2 sau.

## 13. Rủi Ro Va Cach Giam Thieu

| Rui ro | Tac dong | Giam thieu |
|---|---|---|
| Limit qua chat lam hong UX voice | User khong nghe/hoi duoc | Tach policy `/speak`, `/chat`, `/transcribe`; theo doi metrics |
| Parse body trong filter lam mat request body | Controller khong doc duoc body | Dung request wrapper hoac chi parse body o controller/advice cho auth |
| Tin `X-Forwarded-For` khong dung | Attacker spoof IP de ne limit | Chi tin proxy header tu trusted proxy |
| Multi-instance voi in-memory | Quota bi nhan len theo so instance | Dung Redis cho production |
| AI service van public | Bypass backend rate limit | Khoa port 8000/5000 hoac chi bind localhost |
| Redis down | Rate limit loi hoac outage | Chon fail-open/fail-closed theo group, co metric alert |
| Shared global voice session | User nay reset/load-content anh huong user khac | Uu tien them session id va tach state trong AI service |

## 14. Quyet Dinh De Xuat

De xuat implement theo thu tu:

1. Khoa direct public access toi AI services trong production.
2. Them Spring Boot `RateLimitFilter` voi in-memory Bucket4j cho P0/P1.
3. Them response 429 chuan va log/metric co ban.
4. Tuning limit dua tren test UI voice/scan.
5. Chuyen sang Redis-backed limiter truoc khi scale production.
6. Them gateway/edge rate limit neu deploy public internet.
7. Them FastAPI service-local guard neu AI service co nguy co bi goi truc tiep.

Quyet dinh mac dinh nen chon:

- Development/MVP: In-memory Spring limiter.
- Production: Redis-backed Spring limiter + gateway limit + khoa port AI.
- Defense-in-depth: FastAPI limiter cho `/predict`, `/api/transcribe`, `/api/chat`, `/api/classify`, `/api/speak`.
