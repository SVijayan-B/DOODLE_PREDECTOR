from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, traceback, base64
from predictor import predict_doodle_zero_shot
from sarcasm import generate_contextual_sarcasm

app = FastAPI()

# Allow frontend calls (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Prediction Endpoint (handles base64 canvas image) ---
@app.post("/predict")
async def predict(image_base64: str = Form(...)):
    try:
        # Decode base64 string (remove header "data:image/png;base64,...")
        header, encoded = image_base64.split(",", 1)
        image_data = base64.b64decode(encoded)

        # Save decoded PNG
        file_path = os.path.join(UPLOAD_FOLDER, "doodle.png")
        with open(file_path, "wb") as f:
            f.write(image_data)

        # Run prediction
        label, confidence = predict_doodle_zero_shot(file_path)

        return {
            "prediction": label,
            "confidence": round(confidence * 100, 2)
        }
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}

# --- Sarcasm Endpoint ---
class SarcasmRequest(BaseModel):
    label: str
    is_correct: bool

@app.post("/sarcasm")
async def sarcasm(request: SarcasmRequest):
    try:
        comic_sentence = generate_contextual_sarcasm(request.label, request.is_correct)
        return {"comic": comic_sentence}   # ✅ always return under "comic"
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
