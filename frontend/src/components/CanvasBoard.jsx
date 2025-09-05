import React, { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function CanvasBoard({ onSubmit }) {
  const canvasRef = useRef();

  // Export drawing and send to backend
  const handlePredict = async () => {
    const dataUri = await canvasRef.current.exportImage("png");
    const res = await fetch(dataUri);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append("file", blob, "doodle.png");

    onSubmit(formData);
  };

  const handleClear = () => {
    canvasRef.current.clearCanvas();
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={3}
        strokeColor="black"
        width="400px"
        height="400px"
        className="border-2 border-dashed border-gray-400 rounded-lg bg-white"
      />
      <div className="flex gap-3">
        <button
          onClick={handlePredict}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Predict
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
