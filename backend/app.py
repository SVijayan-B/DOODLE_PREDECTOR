from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
import shutil, os, traceback

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

# --- Prediction Endpoint ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        label, confidence = predict_doodle_zero_shot(file_path)

        return {
            "prediction": label,
            "confidence": round(confidence * 100, 2)
        }
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}

# --- Sarcasm Endpoint ---
from fastapi import Body

@app.post("/sarcasm")
async def sarcasm(payload: dict = Body(...)):
    try:
        label = payload.get("label")
        is_correct = payload.get("is_correct", False)
        is_correct_bool = str(is_correct).lower() in ["true", "1", "yes"]

        comic_sentence = generate_contextual_sarcasm(label, is_correct_bool)
        return {"comic": comic_sentence}
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
