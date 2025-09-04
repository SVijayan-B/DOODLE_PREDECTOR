import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import PredictionBox from "./PredictionBox";
import "../styles/Doodle.css";


const DoodleCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.width = "400px";
    canvas.style.height = "400px";

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const handleClear = () => {
    ctxRef.current.clearRect(0, 0, 400, 400);
    setPrediction(null);
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    const formData = new FormData();
    formData.append("file", blob, "doodle.png");

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      {/* Floating doodle emojis */}
      <div className="doodle-icon star" style={{ top: "5%", left: "10%" }}>⭐</div>
      <div className="doodle-icon heart" style={{ top: "20%", right: "15%" }}>❤️</div>
      <div className="doodle-icon bolt" style={{ bottom: "15%", left: "5%" }}>⚡</div>
      <div className="doodle-icon star" style={{ bottom: "5%", right: "20%" }}>🌟</div>

      <h1 className="doodle-title">🎨 Doodle Predictor</h1>
      <p className="subtitle">Draw something... AI will roast it 😏</p>

      <div className="doodle-container">
        <canvas
          ref={canvasRef}
          className="doodle-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="button-group">
          <button onClick={handleClear}>🧹 Clear</button>
          <button onClick={handleSubmit}>🤖 Predict</button>
        </div>
        {prediction && (
          <PredictionBox
            prediction={prediction.prediction}
            comic={prediction.comic}
          />
        )}
      </div>
    </div>
  );
};

export default DoodleCanvas;
