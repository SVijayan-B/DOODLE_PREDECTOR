import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import os

# --- Device setup ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Using device: {device}")

# --- Load CLIP ---
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# --- Load labels dynamically ---
def load_labels():
    labels = []
    labels_dir = os.path.join(os.path.dirname(__file__), "labels")
    for fname in ["quickdraw_345.txt", "coco_80.txt", "openimages_600.txt"]:
        fpath = os.path.join(labels_dir, fname)
        if os.path.exists(fpath):
            with open(fpath, "r") as f:
                labels.extend([line.strip() for line in f if line.strip()])
    if not labels:
        raise RuntimeError("No labels found in 'labels/' folder.")
    return labels

ALL_LABELS = load_labels()

# --- Prediction function ---
def predict_doodle_zero_shot(image_path: str):
    image = Image.open(image_path).convert("RGB")
    inputs = clip_processor(text=ALL_LABELS, images=image, return_tensors="pt", padding=True).to(device)

    with torch.no_grad():
        outputs = clip_model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)

    best_idx = probs.argmax().item()
    confidence = probs[0, best_idx].item()
    label = ALL_LABELS[best_idx]
    return label, confidence
