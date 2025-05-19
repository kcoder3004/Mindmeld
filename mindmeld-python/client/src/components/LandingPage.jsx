import React from "react";

export default function LandingPage({ onStart }) {
  return (
    <div className="landing-page">
      <h1>Welcome to MindMeld!</h1>
      <button onClick={onStart}>Start Game</button>
    </div>
  );
}
