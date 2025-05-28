import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import GameRoom from "./components/GameRoom";

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {!started ? <LandingPage onStart={() => setStarted(true)} /> : <GameRoom />}
    </>
  );
}
