FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    TORCH_NUM_THREADS=2 \
    TORCH_INTEROP_THREADS=1 \
    DEVICE=cpu

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system appgroup \
    && useradd --system --gid appgroup --home-dir /app appuser

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu \
    && pip install -r requirements.txt

COPY main.py ./

USER appuser

EXPOSE 5000

CMD ["uvicorn", "main:app", \
    "--host", "0.0.0.0", \
    "--port", "5000", \
    "--workers", "1"]
