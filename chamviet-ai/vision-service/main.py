import asyncio
import io
import logging
import os
import time

import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image
from ultralytics import YOLO

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("chamviet-vision")

MODEL_PATH = os.getenv("MODEL_PATH", "models/vision.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.70"))
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(10 * 1024 * 1024)))
MAX_CONCURRENT_PREDICTIONS = int(os.getenv("MAX_CONCURRENT_PREDICTIONS", "2"))
TORCH_NUM_THREADS = int(os.getenv("TORCH_NUM_THREADS", "2"))
TORCH_INTEROP_THREADS = int(os.getenv("TORCH_INTEROP_THREADS", "1"))

torch.set_num_threads(TORCH_NUM_THREADS)
try:
    torch.set_num_interop_threads(TORCH_INTEROP_THREADS)
except RuntimeError:
    logger.warning("Torch interop threads were already initialized; keeping current value")

requested_device = os.getenv("DEVICE", "auto").lower()
if requested_device == "auto":
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
else:
    DEVICE = requested_device

try:
    model = YOLO(MODEL_PATH)
    model.to(DEVICE)
except Exception as e:
    raise RuntimeError(f"Cannot load vision model from {MODEL_PATH}: {e}") from e

prediction_semaphore = asyncio.Semaphore(MAX_CONCURRENT_PREDICTIONS)
app = FastAPI(title="ChamViet Vision Service")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "device": DEVICE,
        "cuda_available": torch.cuda.is_available(),
        "torch_num_threads": torch.get_num_threads(),
        "max_concurrent_predictions": MAX_CONCURRENT_PREDICTIONS,
    }


def _predict(image: Image.Image):
    with torch.inference_mode():
        return model.predict(
            source=image,
            conf=CONFIDENCE_THRESHOLD,
            device=DEVICE,
            verbose=False,
        )


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File gửi lên phải là hình ảnh.")

    try:
        contents = await file.read()
        if len(contents) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="File ảnh vượt quá dung lượng cho phép.")

        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File ảnh không hợp lệ: {e}") from e

    started = time.perf_counter()
    try:
        async with prediction_semaphore:
            results = await asyncio.to_thread(_predict, image)

        predictions = []
        for result in results:
            for box in result.boxes:
                predictions.append({
                    "label": result.names[int(box.cls)],
                    "confidence": round(float(box.conf), 2),
                    "box": box.xyxy.tolist()
                })

        logger.info(
            "prediction_complete count=%s elapsed_ms=%.1f device=%s",
            len(predictions),
            (time.perf_counter() - started) * 1000,
            DEVICE,
        )
        return {"status": "success", "data": predictions or None}
    except Exception as e:
        logger.exception("prediction_failed")
        raise HTTPException(status_code=500, detail=f"Lỗi nhận diện ảnh: {e}") from e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
