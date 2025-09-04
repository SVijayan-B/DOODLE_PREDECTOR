import React from "react";
import DoodleCanvas from "./components/DoodleCanvas";
import "./styles/doodle.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="title">🎨 Doodle AI 🤖</h1>
      <p className="subtitle">Draw anything & let the AI roast it!</p>
      <DoodleCanvas />
    </div>
  );
}

export default App;
