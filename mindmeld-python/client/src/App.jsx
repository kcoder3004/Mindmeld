import React, { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import GameRoom from "./components/GameRoom";
import socket from "./socketManager";

export default function App() {
  const [connected, setConnected] = useState(false);
  const [theme, setTheme] = useState("");
  const [matchWord, setMatchWord] = useState(null);
  const [guesses, setGuesses] = useState([]);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));

    socket.on("theme", (newTheme) => {
      setTheme(newTheme);
      setGuesses([]);
      setMatchWord(null);
    });

    socket.on("new_guess", ({ id, word }) => {
      setGuesses((prev) => [...prev, { id, word }]);
    });

    socket.on("match", (word) => {
      setMatchWord(word);
    });

    return () => {
      socket.off("connect");
      socket.off("theme");
      socket.off("new_guess");
      socket.off("match");
    };
  }, []);

  if (!connected) return <LandingPage />;

  return (
    <GameRoom
      theme={theme}
      guesses={guesses}
      matchWord={matchWord}
      onRestart={() => socket.emit("restart_game")}
      onSubmit={(word) => socket.emit("submit_word", word)}
      socketId={socket.id}
    />
  );
}
