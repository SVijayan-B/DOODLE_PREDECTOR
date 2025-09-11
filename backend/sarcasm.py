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
    "Even IIITS goats scribbling promts for C LAB don’t achieve this level of art. 🩺✍️",
    "Bro, you got a new talent to impress a .....",
    "Honestly, better than half the ‘Picassos’ I’ve seen in school notebooks. 🎨",
    "Bro , your doodle’s so good, it’s brighter than guys craving for Partner",
    "BROOO... your not the person to study engineer, you should be doodle art for DLD course. 📚",
    "Bro, this is so good even DLD LAB report would retire gracefully. 🖌️"
    "Even IIITS mess menu can’t serve this much perfection. 🍛✨",
    "Bro, your skills are so sharp they could cut through FHVE assignments. 📘✂️",
    "This doodle’s cleaner than hostel rooms before room check. 🧹😂",
    "Bro, your art is more stable than DLD components in the LAb. ⚙️🤖",
    "Bro, your talent has more layers than OCW concepts. 🖥️📚",
    "Bro, this art has more attendance than Sid's FHVE. ⏰🎨",
    "Honestly, this belongs in IIITS museum of ‘things better than our sports facilities’. 🖼️😂",
    "This doodle just carried more weight than Sid's entire lab report. 📑💪",
]

SELF_ROASTS = [
    "I called that a '{label}'? Wow, even my neurons want to resign bro. 🤖💀",
    "That’s about as accurate as IIITS students begging attendance from teachers — non-existent. 📉",
    "Bro I just embarrassed myself harder than you guys preparing EssentialEnglish course . 💔",
    "I swear, a even DLD circuts could predict better than me. 🥔📡",
    "Imagine training on billions of images and still failing this bad — that’s me . 🔥",
    "My guess was so bad that I should punish by eating mess pooris for a week. 😒",
    "Ah my guess was so bad that I should attend FHVE classes everyday to become normal. 😔",
    "Bro my accuracy is lower than college Wi-Fi speed during submissions. 📶🐌",
    "That was worse than asking seniors for advice and actually expecting them. 📚😂",
    "This was as disappointing as going to mess and seeing poori again. 🥒😭",
    "Bro, I fumbled harder than 1st years introducing themselves in class. 🗣️😬",
    "That flop was bigger than a 1st year’s dream of 9 pointer CGPA. 📉😂",
    "Bro, my output makes less sense than attendance rules here. 📝🙃", 
    "Bro, this prediction is more confusing than college registration. 📑😩",
    "Even FHVE classes help you more clarity than this guess. 📚🥲", 
    "My accuracy is as fake as ‘I’ll start studying from Day 1’. 📘😂",
    "That was more tragic than finding no biriyani in mess at dinner. 🥒💔"
]

def generate_contextual_sarcasm(label: str, is_correct: bool, max_length=100) -> str:
    """
    If correct → sarcastic praise + comparative roast
    If wrong → brutal AI self-roast
    """

    if is_correct:
        base_prompt = (
            f"The user correctly drew a '{label}'. Generate 2 sentences: start by roasting them about their doodle, "
            f"then sarcastically compare them to  engineers, or terrible artists, "
            f"to make the praise yourself."
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
