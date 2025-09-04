import React from "react";

const PredictionBox = ({ prediction, comic }) => {
  return (
    <div className="prediction-box">
      <h3>AI Thinks You Drew: {prediction}</h3>
      <p>💬 {comic}</p>
    </div>
  );
};

export default PredictionBox;
