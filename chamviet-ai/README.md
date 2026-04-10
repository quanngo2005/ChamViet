# ChamViet AI (Docker)

This folder contains two FastAPI services:

- `voice-service` (port `8000`)
- `vision-service` (port `5000`, NVIDIA GPU)

## Quick start

1) Set env

Create `chamviet-ai/voice-service/.env` (or edit the existing one):

```bash
GROQ_API_KEY=your_key_here
```

2) Run

```bash
docker compose -f chamviet-ai/docker-compose.yml up --build
```

## GPU requirements (vision-service)

`vision-service` requires an NVIDIA GPU + NVIDIA Container Toolkit (and Docker configured to use it).

## Troubleshooting: `failed to copy ... input/output error`

Most common causes on Windows:

- Docker Desktop disk image is full/corrupted (large CUDA/PyTorch images can trigger this).
- Building from a Windows drive into WSL2 can cause flaky I/O; building from inside the WSL filesystem is more reliable.

Quick checks/fixes:

- Ensure you have plenty of free space on the drive Docker Desktop uses (often `C:`).
- Restart Docker Desktop; if using WSL2, run `wsl --shutdown` then reopen Docker Desktop.
- Prune build cache/images if needed (`docker buildx prune -af`, `docker system prune -af --volumes`).

## Security note

If a real API key was ever committed/shared, rotate it immediately.
