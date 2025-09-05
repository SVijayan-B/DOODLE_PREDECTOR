import React, { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function CanvasBoard({ onSave }) {
  const canvasRef = useRef(null);

  // Save canvas as image (base64)
  const handleSave = async () => {
    if (canvasRef.current) {
      const dataUrl = await canvasRef.current.exportImage("png"); // export as PNG
      onSave(dataUrl);
    }
  };

  // Clear canvas
  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ReactSketchCanvas
        ref={canvasRef}
        style={{ border: "2px dashed black", borderRadius: "12px" }}
        width="500px"
        height="500px"
        strokeWidth={4}
        strokeColor="black"
        backgroundColor="white"
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow"
        >
          Submit
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
