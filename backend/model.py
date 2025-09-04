import torch
from transformers import CLIPProcessor, CLIPModel, AutoModelForCausalLM, AutoTokenizer
from PIL import Image

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Using device: {device}")

# Load CLIP
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load GPT-Neo (125M)
gen_tokenizer = AutoTokenizer.from_pretrained("EleutherAI/gpt-neo-125M")
gen_model = AutoModelForCausalLM.from_pretrained("EleutherAI/gpt-neo-125M").to(device)

def predict_doodle(image_path: str, possible_labels: list):
    image = Image.open(image_path).convert("RGB")
    inputs = clip_processor(text=possible_labels, images=image, return_tensors="pt", padding=True).to(device)

    with torch.no_grad():
        outputs = clip_model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)

    best_idx = probs.argmax().item()
    label = possible_labels[best_idx]

    return label

def generate_sarcasm(label: str, max_tokens=50):
    prompt = f"Write a funny, sarcastic, art-related comment about a doodle of a {label}:"
    inputs = gen_tokenizer(prompt, return_tensors="pt").to(device)
    output = gen_model.generate(**inputs, max_new_tokens=max_tokens, do_sample=True, top_p=0.9, temperature=0.8)
    sentence = gen_tokenizer.decode(output[0], skip_special_tokens=True)
    return sentence
