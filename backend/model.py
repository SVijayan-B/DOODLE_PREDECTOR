import torch
from transformers import CLIPProcessor, CLIPModel, AutoModelForCausalLM, AutoTokenizer
from PIL import Image
import os

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Using device: {device}")

# Load CLIP
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load GPT-Neo (for sarcasm generation)
gen_tokenizer = AutoTokenizer.from_pretrained("EleutherAI/gpt-neo-125M")
gen_model = AutoModelForCausalLM.from_pretrained("EleutherAI/gpt-neo-125M").to(device)

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
        raise RuntimeError("No labels found. Please add text files in 'labels/' folder.")
    return labels

ALL_LABELS = load_labels()

# --- Prediction function ---
def predict_doodle_zero_shot(image_path: str):
    image = Image.open(image_path).convert("RGB")
    inputs = clip_processor(text=ALL_LABELS, images=image, return_tensors="pt", padding=True).to(device)

    with torch.no_grad():
        outputs = clip_model(**inputs)
        logits_per_image = outputs.logits_per_image  # [1, num_labels]
        probs = logits_per_image.softmax(dim=1)

    best_idx = probs.argmax().item()
    confidence = probs[0, best_idx].item()
    label = ALL_LABELS[best_idx]
    return label, confidence

# --- Sarcasm generation ---
def generate_sarcasm(label: str, max_tokens=50):
    prompt = f"Write a short, funny, sarcastic comment about a doodle of a {label}:"
    inputs = gen_tokenizer(prompt, return_tensors="pt").to(device)
    output = gen_model.generate(
        **inputs,
        max_new_tokens=max_tokens,
        do_sample=True,
        top_p=0.9,
        temperature=0.8
    )
    sentence = gen_tokenizer.decode(output[0], skip_special_tokens=True)
    return sentence
