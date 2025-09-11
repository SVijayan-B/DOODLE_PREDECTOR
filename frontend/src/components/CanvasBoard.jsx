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
        width="700px"
        height="700px"
        strokeWidth={4}
        strokeColor="black"
        backgroundColor="white"
      />

      <div style={{
        display: "flex", 
        gap: "15px", 
        marginTop: "30px ",
        justifyContent: "center"
        }}>
        <button
            onClick={handleSave}
            style={{
                fontFamily: "'Comic Neue', cursive",
                background: "#4ade80",
                border: "3px solid #000",
                padding: "10px 20px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                borderRadius: "12px",
                boxShadow: "3px 3px 0px #000",
                color: "#000",
                transition: "all 0.1s ease-in-out"
        }}
        onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05) rotate(-1deg)";
            e.target.style.background = "#22c55e";
        }}
        onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.background = "#4ade80";
        }}
    >
        🎯 Submit
    </button>
    <button
        onClick={handleClear}
        style={{
        fontFamily: "'Comic Neue', cursive",
        background: "#f87171",
        border: "3px solid #000",
        padding: "10px 20px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        borderRadius: "12px",
        boxShadow: "3px 3px 0px #000",
        color: "#000",
        transition: "all 0.1s ease-in-out"
        }}
        onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05) rotate(-1deg)";
            e.target.style.background = "#ef4444";
        }}
        onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.background = "#f87171";
        }}
    >
        🗑️ Clear
    </button>
    </div>
</div>
);
}
