import React, { useState } from "react";
import GameRoom from "./components/GameRoom";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [inGame, setInGame] = useState(false);

  return (
    <div className="app-container">
      {inGame ? (
        <GameRoom onLeave={() => setInGame(false)} />
      ) : (
        <LandingPage onStart={() => setInGame(true)} />
      )}
    </div>
  );
}
