import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import random

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Sarcasm model using device: {device}")

# Load DialoGPT-small
sarcasm_tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
sarcasm_model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small").to(device)

# Roast booster pools
PRAISE_COMPARISON = [
    "Even doctors scribbling prescriptions don’t achieve this level of art. 🩺✍️",
    "This could hang in a hospital waiting room, and patients would think it’s modern art. 🖼️",
    "Engineers everywhere just gave up their AutoCAD licenses after seeing this. 🏗️",
    "Honestly, better than half the ‘Picassos’ I’ve seen in school notebooks. 🎨",
    "Bro, this is so good even MS Paint would retire gracefully. 🖌️"
]

SELF_ROASTS = [
    "I called that a '{label}'? Wow, even my neurons want to resign. 🤖💀",
    "That’s about as accurate as a JEE aspirant’s social life — non-existent. 📉",
    "Bro I just embarrassed myself harder than a doctor who misread an ECG. 💔",
    "I swear, a potato with WiFi could predict better than me. 🥔📡",
    "Imagine training on billions of images and still failing this bad — that’s me. 🔥"
]

def generate_contextual_sarcasm(label: str, is_correct: bool, max_length=100) -> str:
    """
    If correct → sarcastic praise + comparative roast
    If wrong → brutal AI self-roast
    """

    if is_correct:
        base_prompt = (
            f"The user correctly drew a '{label}'. Generate 2-3 sentences: start by praising them, "
            f"then sarcastically compare them to doctors, engineers, or terrible artists, "
            f"to make the praise funny."
        )
    else:
        base_prompt = (
            f"I wrongly predicted the doodle as '{label}'. Roast me brutally in 2-3 sentences, "
            f"be self-deprecating, exaggerate my stupidity, and make the user laugh at my failure."
        )

    # Encode & generate
    inputs = sarcasm_tokenizer.encode(base_prompt + sarcasm_tokenizer.eos_token, return_tensors="pt").to(device)

    outputs = sarcasm_model.generate(
        inputs,
        max_length=max_length,
        pad_token_id=sarcasm_tokenizer.eos_token_id,
        do_sample=True,
        top_k=40,
        top_p=0.9,
        temperature=1.1,
        num_return_sequences=1
    )

    reply = sarcasm_tokenizer.decode(outputs[0][inputs.shape[-1]:], skip_special_tokens=True).strip()

    # Add extra spice from boosters
    if is_correct:
        reply += " " + random.choice(PRAISE_COMPARISON)
    else:
        reply = reply.replace("{label}", label) + " " + random.choice(SELF_ROASTS).format(label=label)

    # ✅ Fallback if reply is empty
    if not reply.strip():
        reply = "Hmm… even my circuits are speechless 🤖"

    return reply.strip()
