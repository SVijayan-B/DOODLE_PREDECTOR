import React from "react";

export default function PredictionResult({ prediction, confidence, comic }) {
  if (!prediction) return null;

  return (
    <div className="result-card">
      <h2>🎉 Final Prediction: {prediction}</h2>
      <p>Confidence: {confidence}%</p>
      <p className="comic-text">💬 {comic}</p>
    </div>
  );
}
