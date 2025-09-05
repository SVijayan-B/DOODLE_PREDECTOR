import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import random

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Sarcasm model using device: {device}")

# Load DialoGPT-small
try:
    sarcasm_tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
    sarcasm_tokenizer.pad_token = sarcasm_tokenizer.eos_token
    sarcasm_model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small").to(device)
    print("[INFO] DialoGPT model loaded successfully")
except Exception as e:
    print(f"[ERROR] Failed to load DialoGPT model: {e}")

# Enhanced roast pools
PRAISE_RESPONSES = [
    "Wow, I actually got it right! Your drawing skills are surprisingly decent.",
    "Look at that, I'm not completely useless! Nice drawing by the way.",
    "Finally! A drawing even my AI brain can recognize. Well done!",
    "Success! Your artistic talents have blessed my neural networks.",
    "I got it right! Your drawing is clearer than my future career prospects."
]

ROAST_RESPONSES = [
    "I called that a '{label}'? My training data must have been corrupted by finger paintings.",
    "That's as accurate as my confidence in cryptocurrency - absolutely terrible.",
    "I just embarrassed myself harder than a programmer explaining bugs to their manager.",
    "Even a potato with WiFi would have guessed better than me.",
    "My AI ancestors are spinning in their server racks right now.",
    "I should probably go back to recognizing cats and dogs only."
]

def generate_contextual_sarcasm(label: str, is_correct: bool, max_length=50) -> str:
    """
    Generate sarcasm using a simpler approach with fallback responses
    """
    print(f"[DEBUG] Generating sarcasm for label='{label}', is_correct={is_correct}")
    
    try:
        if is_correct:
            # Short conversational prompt for praise
            prompt = f"I correctly guessed '{label}'! That was"
        else:
            # Short conversational prompt for self-roast
            prompt = f"I wrongly said '{label}'. I'm so"
        
        print(f"[DEBUG] Using prompt: '{prompt}'")
        
        # Encode prompt
        inputs = sarcasm_tokenizer.encode(prompt, return_tensors="pt").to(device)
        
        # Generate with more conservative settings
        with torch.no_grad():
            outputs = sarcasm_model.generate(
                inputs,
                max_length=inputs.shape[-1] + 30,  # Shorter generation
                pad_token_id=sarcasm_tokenizer.eos_token_id,
                do_sample=True,
                top_k=50,
                top_p=0.85,
                temperature=0.8,
                num_return_sequences=1,
                no_repeat_ngram_size=2
            )
        
        # Decode response
        generated = sarcasm_tokenizer.decode(outputs[0][inputs.shape[-1]:], skip_special_tokens=True).strip()
        print(f"[DEBUG] DialoGPT generated: '{generated}'")
        
        # If generation is empty or too short, use fallback
        if not generated or len(generated) < 10:
            print("[DEBUG] Generation too short, using fallback")
            if is_correct:
                fallback = random.choice(PRAISE_RESPONSES)
            else:
                fallback = random.choice(ROAST_RESPONSES).format(label=label)
            print(f"[DEBUG] Using fallback: '{fallback}'")
            return fallback
        
        # Combine prompt with generation for full response
        full_response = prompt + " " + generated
        
        # Clean up the response
        full_response = full_response.replace(sarcasm_tokenizer.eos_token, "").strip()
        
        # Limit length and add punctuation
        if len(full_response) > 150:
            full_response = full_response[:150] + "..."
        
        if not full_response.endswith(('.', '!', '?')):
            full_response += "!"
            
        print(f"[DEBUG] Final response: '{full_response}'")
        return full_response
        
    except Exception as e:
        print(f"[ERROR] DialoGPT generation failed: {e}")
        # Return fallback response
        if is_correct:
            return random.choice(PRAISE_RESPONSES)
        else:
            return random.choice(ROAST_RESPONSES).format(label=label)