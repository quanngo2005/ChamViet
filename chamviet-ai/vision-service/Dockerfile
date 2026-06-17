# syntax=docker/dockerfile:1.7
FROM python:3.11-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

RUN python -m venv "$VIRTUAL_ENV"

COPY requirements.txt ./

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip setuptools wheel \
    && pip install --index-url https://download.pytorch.org/whl/cpu torch torchvision \
    && pip install -r requirements.txt \
    && pip check \
    && pip uninstall -y pip setuptools wheel \
    && find /opt/venv -type d -name "__pycache__" -prune -exec rm -rf {} +


FROM python:3.11-slim-bookworm AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:$PATH" \
    HOME=/app \
    YOLO_CONFIG_DIR=/app/.config/ultralytics \
    MPLCONFIGDIR=/app/.cache/matplotlib \
    TORCH_NUM_THREADS=2 \
    TORCH_INTEROP_THREADS=1 \
    DEVICE=cpu

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        libgl1 \
        libglib2.0-0 \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system appgroup \
    && useradd --system --gid appgroup --home-dir /app appuser \
    && mkdir -p /app/.cache/matplotlib /app/.config/ultralytics \
    && chown -R appuser:appgroup /app

COPY --from=builder --chown=appuser:appgroup /opt/venv /opt/venv
COPY --chown=appuser:appgroup main.py ./
COPY --chown=appuser:appgroup models ./models

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c \
      "import urllib.request, sys; \
       r = urllib.request.urlopen('http://127.0.0.1:5000/health', timeout=5); \
       sys.exit(0 if r.status == 200 else 1)" \
    || exit 1

CMD ["uvicorn", "main:app", \
    "--host", "0.0.0.0", \
    "--port", "5000", \
    "--workers", "1"]
