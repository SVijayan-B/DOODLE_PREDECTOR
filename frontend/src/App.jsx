import React, { useState } from "react";
import axios from "axios";
import CanvasBoard from "./components/CanvasBoard";

export default function App() {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [sarcasm, setSarcasm] = useState("");
  const [showButtons, setShowButtons] = useState(false);

  const handleSave = async (dataUrl) => {
    const formData = new FormData();
    formData.append("image_base64", dataUrl);

    try {
      const res = await axios.post("http://localhost:8000/predict", formData);
      setPrediction(res.data.prediction);
      setConfidence(res.data.confidence);
      setShowButtons(true);
      setSarcasm("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSarcasm = async (isCorrect) => {
    try {
      const res = await axios.post("http://localhost:8000/sarcasm", {
        label: prediction,
        is_correct: isCorrect,
      });
      setSarcasm(res.data.comic);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/doodles.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "300px",
        fontFamily: "'Comic Neue', cursive",
      }}
    >
      {/* Header */}
      <h1 className="text-7xl font-extrabold text-pink-500 mb-6 drop-shadow-[6px_6px_0px_black] tracking-widest text-center">
        🎨 Doodle AI 🤪
      </h1>

      {/* Canvas Section */}
      <div className="p-4 border-8 border-black rounded-3xl bg-white shadow-[10px_10px_0px_black] comic-frame">
        <CanvasBoard onSave={handleSave} />
      </div>

      {/* Prediction */}
      {prediction && (
        <div className="mt-6 text-4xl font-extrabold text-blue-600 text-center drop-shadow-[5px_5px_0px_black]">
          <p>
            Looks like a{" "}
            <span className="text-yellow-400 underline">{prediction}</span> 🎉
            <br />
            <span className="text-lg text-black">
              (Confidence: {confidence}%)
            </span>
          </p>
        </div>
      )}

      {/* Yes/No Buttons */}
      {showButtons && (
        <div className="flex gap-10 mt-8">
          <button
            onClick={() => handleSarcasm(true)}
            className="px-10 py-5 bg-green-400 hover:bg-green-500 text-black font-extrabold text-2xl rounded-full border-4 border-black shadow-[7px_7px_0px_black] transition-transform hover:scale-110 comic-btn"
          >
            ✅ YES!
          </button>
          <button
            onClick={() => handleSarcasm(false)}
            className="px-10 py-5 bg-red-400 hover:bg-red-500 text-black font-extrabold text-2xl rounded-full border-4 border-black shadow-[7px_7px_0px_black] transition-transform hover:scale-110 comic-btn"
          >
            ❌ NOPE!
          </button>
        </div>
      )}

      {/* Sarcasm Bubble */}
      {sarcasm && (
        <div className="relative mt-12 max-w-3xl bg-yellow-300 border-8 border-black rounded-3xl p-8 shadow-[8px_8px_0px_black] text-3xl leading-relaxed comic-bubble">
          <p className="text-black font-bold">🤖 {sarcasm}</p>
          {/* Bubble tail */}
          <div className="absolute -bottom-7 left-20 w-0 h-0 border-t-[50px] border-t-yellow-300 border-x-[35px] border-x-transparent"></div>
          <div className="absolute -bottom-9 left-20 w-0 h-0 border-t-[54px] border-t-black border-x-[39px] border-x-transparent"></div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-12 text-xl text-purple-700 font-extrabold drop-shadow-[3px_3px_0px_white]">
        ✍️ Draw. 🎭 Laugh. 🎉 Repeat!
      </p>
    </div>
  );
}
