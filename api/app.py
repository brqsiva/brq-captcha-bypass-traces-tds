from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import numpy as np
import cv2
from preprocess import preprocess_image
from PIL import Image, UnidentifiedImageError
from io import BytesIO

app = FastAPI()

# Load YOLOv8 model once at startup
model = YOLO("weights/best.pt")

@app.post("/detect-text")
async def detect_text(file: UploadFile = File(...)):
    """
    Accepts an image file, preprocesses it, and returns detected text (class names) sorted left-to-right.
    """
    try:
        # Read file content
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        # Debug: Check file size
        print(f"Received file: {file.filename}, size: {len(contents)} bytes")
        
        # Validate it's a proper image first
        try:
            # Try to open with PIL first
            test_img = Image.open(BytesIO(contents))
            test_img.verify()  # Verify it's a valid image
        except (UnidentifiedImageError, SyntaxError) as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image validation failed: {str(e)}")

        # 1️⃣ Preprocess image
        try:
            preprocessed_img = preprocess_image(contents)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image preprocessing failed: {str(e)}")

        # 2️⃣ Convert PIL to OpenCV format (BGR)
        try:
            img_cv = np.array(preprocessed_img)
            img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2BGR)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image conversion failed: {str(e)}")

        # 3️⃣ YOLO prediction
        try:
            results = model.predict(source=img_cv, save=False, imgsz=640)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"YOLO prediction failed: {str(e)}")

        boxes = results[0].boxes
        detected = []
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            cls_id = int(box.cls[0])
            cls_name = results[0].names[cls_id]
            detected.append((x1.item(), cls_name))

        # 4️⃣ Sort left-to-right and form string
        detected_sorted = sorted(detected, key=lambda x: x[0])
        detected_string = "".join([cls_name for _, cls_name in detected_sorted])

        return JSONResponse(content={"detected_text": detected_string})
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")