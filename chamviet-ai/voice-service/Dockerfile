FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# dùng cache pip (BuildKit)
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip && \
    pip install --no-compile --prefix=/install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu && \
    find /install -name "*.pyc" -delete && \
    find /install -type d -name "__pycache__" -empty -delete

# --- Runtime stage ---
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/install/lib/python3.11/site-packages \
    PATH=/install/bin:$PATH

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    libsndfile1 \
    libportaudio2 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && addgroup --system appgroup \
  && adduser --system --ingroup appgroup appuser

COPY --from=builder /install /install
COPY main.py config.py ./
COPY services ./services
COPY data ./data

USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "2"]