import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import io

device = "cuda" if torch.cuda.is_available() else "cpu"

# Load CLIP model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Default labels (fallback if user does not send any)
DEFAULT_LABELS = ["cat", "dog", "car", "tree", "house", "bicycle", "sun", "flower", "fish", "bird"]

def predict_image(image_bytes: bytes, custom_labels=None):
    labels = custom_labels if custom_labels else DEFAULT_LABELS
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    inputs = processor(text=labels, images=image, return_tensors="pt", padding=True).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)

    top_prob, top_idx = probs[0].max(dim=0)
    return labels[top_idx], float(top_prob)
