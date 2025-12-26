# 🎨 DOODLE_PREDECTOR 🤖✨

Welcome to **Doodle AI**, a fun AI-powered doodle recognition app with a twist of **sarcasm and humor**!  
This project was built to show how AI can be **creative, entertaining, and a little bit savage**.  

---

## 🚀 Features
- 🖌️ **Draw Anything** – Unleash your creativity on the doodle canvas.  
- 🔮 **AI Prediction** – The AI tries to guess what you drew (with confidence %).  
- 😂 **Sarcastic Feedback** –  
  - If the AI is **correct**, it praises you with hilarious sarcasm.  
  - If the AI is **wrong**, it **roasts itself** harder than you can imagine.  
- 🎭 **Comic-Themed UI** – Bright, fun, kid-styled doodle vibes with comic fonts & colors.  

---

## 🖼️ How It Works
1. Draw your doodle on the **canvas**.  
2. Hit the **Submit** button.  
3. AI will guess your doodle + show confidence score.  
4. Select **Yes** or **No** depending on whether it got it right.  
5. Enjoy the **sarcastic roast or praise** generated instantly.  

---

## 🛠️ Tech Stack
### 🎨 Frontend
- React + Vite  
- TailwindCSS + Custom Comic CSS  
- React Sketch Canvas  

### ⚡ Backend
- FastAPI  
- Hugging Face Transformers (DialoGPT for sarcasm generation)  
- Pillow (PIL) for image handling  

---

## 📦 Installation & Setup

### 1️. Clone the Repo
```bash
git clone https://github.com/SVijayan-B/DOODLE_PREDECTOR.git
cd DOODLE_PREDECTOR
```
### 2. Setup backend
```
cd backend
python -m venv venv
venv\Scripts\activate   # (Windows)
# source venv/bin/activate  # (Linux/Mac)

pip install -r requirements.txt
uvicorn app:app --reload
```
### 3. Setup FrontEnd

```
cd frontend
npm install
npm run dev
```

# ✨✨ Now You Can Enjoy the Doodle Ai ✨✨
