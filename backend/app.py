from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from model import predict_image
import json

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Doodle Guesser Backend Running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...), labels: Optional[str] = Form(None)):
    contents = await file.read()

    # Convert labels string to Python list if provided
    custom_labels = json.loads(labels) if labels else None

    label, confidence = predict_image(contents, custom_labels)
    return {"prediction": label, "confidence": confidence}
