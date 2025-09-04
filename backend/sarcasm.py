import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import random

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Sarcasm model using device: {device}")

# Load DialoGPT (small to fit in 6GB VRAM)
sarcasm_tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
sarcasm_model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small").to(device)

def generate_contextual_sarcasm(label: str, is_correct: bool, max_length=60) -> str:
    """
    Generate sarcasm in two modes:
    - If prediction is correct -> sarcastic roast + fake praise
    - If prediction is wrong -> AI self-roast
    """

    if is_correct:
        prompt = (
            f"Roast the user sarcastically but also ironically praise them for correctly drawing a '{label}'. "
            f"Keep it short, funny, and like roasting a JEE aspirant."
        )
    else:
        prompt = (
            f"Roast yourself sarcastically because you wrongly predicted a doodle as '{label}'. "
            f"Be self-deprecating and funny like a failed JEE aspirant."
        )

    inputs = sarcasm_tokenizer.encode(prompt + sarcasm_tokenizer.eos_token, return_tensors="pt").to(device)

    outputs = sarcasm_model.generate(
        inputs,
        max_length=max_length,
        pad_token_id=sarcasm_tokenizer.eos_token_id,
        do_sample=True,
        top_k=50,
        top_p=0.9,
        temperature=0.8
    )

    reply = sarcasm_tokenizer.decode(outputs[:, inputs.shape[-1]:][0], skip_special_tokens=True)

    # In case model rambles, trim extra sentences
    reply = reply.split(".")[0] + "."

    return reply.strip()
