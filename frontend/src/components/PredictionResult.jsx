import React from "react";

export default function PredictionResult({ result, onFeedback, sarcasm }) {
  if (!result) return null;

  return (
    <div className="mt-6 p-4 border rounded-xl bg-gray-100 shadow-md w-[400px] text-center">
      <h2 className="text-xl font-bold">
        Prediction: <span className="text-blue-600">{result.prediction}</span>
      </h2>
      <p className="text-gray-700">
        Confidence: {result.confidence.toFixed(2)}%
      </p>

      {!sarcasm ? (
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={() => onFeedback(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Yes ✅
          </button>
          <button
            onClick={() => onFeedback(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            No ❌
          </button>
        </div>
      ) : (
        <p className="mt-4 text-lg italic text-purple-700">{sarcasm}</p>
      )}
    </div>
  );
}
