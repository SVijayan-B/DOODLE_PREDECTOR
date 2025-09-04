from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil, os, traceback
from model import predict_doodle_zero_shot, generate_sarcasm

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

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Save upload
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run model
        label, confidence = predict_doodle_zero_shot(file_path)
        comic_sentence = generate_sarcasm(label)

        return {
            "prediction": label,
            "confidence": round(confidence * 100, 2),  # %
            "comic": comic_sentence
        }
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
