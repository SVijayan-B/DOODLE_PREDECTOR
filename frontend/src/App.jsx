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

  // Inline styles for guaranteed override
  const appStyles = {
    fontFamily: "'Comic Neue', cursive",
    lineHeight: "1.3",
    color: "#343131ff",
    margin: 0,
    minHeight: "100vh",
    maxHeight: "100vh",
    textAlign: "center",
    padding: "10px",
    background: "repeating-linear-gradient(45deg, #fefefe, #fefefe 20px, #fdf5f5 20px, #fdf5f5 40px)",
    overflow: "hidden"
  };

  const containerStyles = {
    maxWidth: "900px",
    maxHeight: "95vh",
    margin: "auto",
    background: "#fff",
    border: "4px dashed #222",
    borderRadius: "20px",
    padding: "15px",
    boxShadow: "8px 8px 0px #000",
    position: "relative",
    overflow: "auto"
  };

  const titleStyles = {
    fontSize: "2.2rem",
    color: "#222",
    textShadow: "2px 2px #ffeb3b, -2px -2px #ff80ab",
    marginBottom: "5px",
    fontWeight: "700",
    fontFamily: "'Comic Neue', cursive"
  };

  const taglineStyles = {
    fontSize: "1.1rem",
    marginBottom: "15px",
    color: "#666",
    fontStyle: "italic",
    fontFamily: "'Comic Neue', cursive"
  };

  const canvasWrapperStyles = {
    display: "flex",
    justifyContent: "center",
    margin: "15px 0",
    padding: "50px 1px",
    border: "6px solid #000",
    borderRadius: "20px",
    background: "#fff",
    boxShadow: "5px 5px 0px #000"
  };

  const predictionBoxStyles = {
    marginTop: "15px",
    background: "#fff",
    padding: "15px",
    border: "3px solid #000",
    borderRadius: "15px",
    boxShadow: "4px 4px 0px #000",
    fontSize: "1.2rem",
    fontWeight: "bold",
    fontFamily: "'Comic Neue', cursive"
  };

  const predictionTextStyles = {
    color: "#2563eb",
    fontSize: "1.4rem",
    marginBottom: "8px",
    fontFamily: "'Comic Neue', cursive"
  };

  const confidenceTextStyles = {
    color: "#666",
    fontSize: "1rem",
    fontFamily: "'Comic Neue', cursive"
  };

  const buttonsContainerStyles = {
    marginTop: "15px",
    display: "flex",
    gap: "15px",
    justifyContent: "center"
  };

  const baseButtonStyles = {
    fontFamily: "'Comic Neue', cursive",
    border: "3px solid #000",
    padding: "10px 20px",
    margin: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "12px",
    transition: "all 0.1s ease-in-out",
    boxShadow: "3px 3px 0px #000",
    color: "#000",
    textDecoration: "none"
  };

  const correctButtonStyles = {
    ...baseButtonStyles,
    background: "#4ade80"
  };

  const wrongButtonStyles = {
    ...baseButtonStyles,
    background: "#f87171"
  };

  const sarcasmBoxStyles = {
    marginTop: "15px",
    padding: "15px",
    border: "3px dotted #e91e63",
    borderRadius: "15px",
    background: "#fff0f6",
    boxShadow: "4px 4px 0px #000",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#d81b60",
    position: "relative",
    fontFamily: "'Comic Neue', cursive",
    animation: "doodle-wiggle 0.8s ease-in-out infinite alternate"
  };

  const hrStyles = {
    margin: "20px 0",
    border: "none",
    borderTop: "3px dashed #000"
  };

  const footerTextStyles = {
    color: "#888",
    marginTop: "10px",
    fontSize: "1rem",
    fontStyle: "italic",
    fontWeight: "bold",
    fontFamily: "'Comic Neue', cursive"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        
        @keyframes doodle-wiggle {
          from {
            transform: rotate(-1deg);
          }
          to {
            transform: rotate(1deg);
          }
        }
        
        /* Override index.css conflicting rules */
        body {
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          place-items: unset !important;
          background-color: unset !important;
        }
        
        #root {
          display: block !important;
          width: 100% !important;
        }
      `}</style>
      
      <div style={appStyles}>
        <div style={containerStyles}>
          <h1 style={titleStyles}>🎨 IOTA DOODLE ROASTER 🤖</h1>
          <p style={taglineStyles}>Let's see your drawing skills!</p>

          {/* Canvas Section */}
          <div style={canvasWrapperStyles}>
            <CanvasBoard onSave={handleSave} />
          </div>

          {/* Prediction Result */}
          {prediction && (
            <div style={predictionBoxStyles}>
              <div style={predictionTextStyles}>
                🎯 Looks like a <span style={{color: '#f59e0b', textDecoration: 'underline'}}>{prediction}</span>!
              </div>
              <div style={confidenceTextStyles}>
                Confidence: {confidence}%
              </div>
            </div>
          )}

          {/* Feedback Buttons */}
          {showButtons && (
            <div style={buttonsContainerStyles}>
              <button 
                onClick={() => handleSarcasm(true)}
                style={correctButtonStyles}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.08) rotate(-2deg)";
                  e.target.style.background = "#22c55e";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.background = "#4ade80";
                }}
              >
                ✅ Correct!
              </button>
              <button 
                onClick={() => handleSarcasm(false)}
                style={wrongButtonStyles}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.08) rotate(-2deg)";
                  e.target.style.background = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.background = "#f87171";
                }}
              >
                ❌ Wrong!
              </button>
            </div>
          )}

          {/* Sarcasm Box with wiggle animation */}
          {sarcasm && (
            <div style={sarcasmBoxStyles}>
              🤖💬 <span>{sarcasm}</span>
            </div>
          )}

          <hr style={hrStyles} />
          <p style={footerTextStyles}>
            ✨ Draw. Laugh. Repeat!
          </p>
        </div>
      </div>
    </>
  );
}