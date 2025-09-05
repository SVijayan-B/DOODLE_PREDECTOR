import React, { useState } from "react";
import CanvasBoard from "./components/CanvasBoard";
import PredictionResult from "./components/PredictionResult";
import axios from "axios";

export default function App() {
  const [result, setResult] = useState(null);
  const [sarcasm, setSarcasm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async (formData) => {
    setSarcasm("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("⚠️ Oops! Couldn’t get a prediction. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isCorrect) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/sarcasm", {
        label: result.prediction,
        is_correct: isCorrect,
      });
      setSarcasm(res.data.sarcasm);
    } catch (err) {
      console.error("Sarcasm error:", err);
      setSarcasm("⚠️ Could not fetch sarcasm.");
    }
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        .app-container {
          font-family: 'Comic Neue', cursive, system-ui, Avenir, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          font-weight: 400;
          color: #333;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          margin: 0;
          min-width: 320px;
          min-height: 100vh;
          text-align: center;
          background: repeating-linear-gradient(
            45deg,
            #fefefe,
            #fefefe 20px,
            #fdf5f5 20px,
            #fdf5f5 40px
          );
          padding: 20px;
        }

        /* 🎨 Doodle Theme */
        .container {
          max-width: 720px;
          margin: auto;
          background: #fff;
          border: 5px dashed #222;
          border-radius: 25px;
          padding: 25px;
          box-shadow: 10px 10px 0px #000;
          position: relative;
        }

        h1 {
          font-size: 2.8rem;
          color: #222;
          text-shadow: 2px 2px #ffeb3b, -2px -2px #ff80ab;
          margin-bottom: 10px;
        }

        .tagline {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #666;
          font-style: italic;
        }

        .canvas-wrapper {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }

        canvas {
          border: 8px solid #000;
          border-radius: 15px;
          background: #fff;
          box-shadow: 6px 6px 0px #000;
          cursor: crosshair;
        }

        /* Controls */
        .controls {
          margin-top: 15px;
        }

        button {
          font-family: 'Comic Neue', cursive;
          background: #ffeb3b;
          border: 3px solid #000;
          padding: 10px 22px;
          margin: 6px;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 14px;
          transition: transform 0.1s ease-in-out, background 0.2s;
          box-shadow: 4px 4px 0px #000;
        }
        button:hover {
          transform: scale(1.08) rotate(-2deg);
          background: #ffd54f;
        }

        hr {
          margin: 35px 0;
          border: none;
          border-top: 4px dashed #000;
        }

        .result-box {
          margin-top: 20px;
          background: #fff;
          padding: 15px;
          border: 3px solid #000;
          border-radius: 15px;
          min-height: 50px;
          box-shadow: 5px 5px 0px #000;
          font-size: 1.2rem;
          white-space: pre-line;
        }

        /* ✨ Fun Sarcasm Box */
        .sarcasm-box {
          margin-top: 20px;
          padding: 18px;
          border: 4px dotted #e91e63;
          border-radius: 20px;
          background: #fff0f6;
          box-shadow: 5px 5px 0px #000;
          font-size: 1.3rem;
          font-weight: bold;
          color: #d81b60;
          animation: wiggle 0.8s ease-in-out infinite alternate;
        }

        @keyframes wiggle {
          from {
            transform: rotate(-1deg);
          }
          to {
            transform: rotate(1deg);
          }
        }

        .read-the-docs {
          color: #888;
          margin-top: 15px;
          font-size: 0.95rem;
          font-style: italic;
        }
      `}</style>

      <div className="container">
        <h1>🎨 Doodle Predictor + Sarcasm 🤖</h1>
        <p className="tagline">Draw something and let the AI guess!</p>

        <div className="canvas-wrapper">
          <CanvasBoard onSubmit={handlePredict} />
        </div>

        {loading && <p>⏳ Thinking...</p>}
        {error && <p className="result-box">{error}</p>}

        <PredictionResult
          result={result}
          onFeedback={handleFeedback}
          sarcasm={sarcasm}
        />

        {sarcasm && (
          <div className="sarcasm-box">
            🤖💬 <span>{sarcasm}</span>
          </div>
        )}

        <hr />
        <p className="read-the-docs">
          ✨ Powered by AI — draw freely and test its sense of humor!
        </p>
      </div>
    </div>
  );
}
