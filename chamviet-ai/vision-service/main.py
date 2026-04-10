from fastapi import FastAPI, UploadFile, File, HTTPException
from ultralytics import YOLO
import io
from PIL import Image

app = FastAPI()

# Tải mô hình vào bộ nhớ khi khởi chạy server
try:
    model = YOLO("models/vision.pt")
except Exception as e:
    print(f"Lỗi tải mô hình: {e}")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # 1. Kiểm tra định dạng file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File gửi lên phải là hình ảnh.")

    try:
        # 2. Đọc ảnh trực tiếp từ bộ nhớ RAM
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # 3. Thực hiện nhận diện (Inference)
        # Sử dụng stream=True để tối ưu bộ nhớ nếu xử lý nhiều ảnh
        results = model.predict(source=image, conf=0.25)

        # 4. Trích xuất thông tin cần thiết
        predictions = []
        for result in results:
            for box in result.boxes:
                predictions.append({
                    "label": result.names[int(box.cls)],
                    "confidence": round(float(box.conf), 2),
                    "box": box.xyxy.tolist() # Tọa độ khung nhận diện
                })

        return {"status": "success", "data": predictions}

    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)