import React, { useEffect, useState } from "react";
import socket from "./socketManager";

export default function App() {
  const [theme, setTheme] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [match, setMatch] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("theme", (newTheme) => {
      setTheme(newTheme);
      setGuesses([]);
      setMatch(null);
    });

    socket.on("new_guess", ({ id, word }) => {
      setGuesses((prev) => [...prev, { id, word }]);
    });

    socket.on("match", (word) => {
      setMatch(word);
    });

    return () => {
      socket.off("theme");
      socket.off("new_guess");
      socket.off("match");
    };
  }, []);

  const submitGuess = () => {
    if (!input.trim()) return;
    socket.emit("submit_word", input.trim());
    setInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1>MindMeld Game</h1>
      <h2>Theme: {theme}</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your guess"
        onKeyDown={(e) => { if (e.key === "Enter") submitGuess(); }}
        style={{ padding: 8, width: "80%", marginRight: 8 }}
      />
      <button onClick={submitGuess} style={{ padding: 8 }}>
        Submit
      </button>

      {match && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: 5,
          }}
        >
          🎉 Match found: <strong>{match}</strong>
        </div>
      )}

      <h3>Guesses so far:</h3>
      <ul>
        {guesses.map(({ id, word }, i) => (
          <li key={i}>
            <strong>{id === socket.id ? "You" : "Player"}</strong> guessed: {word}
          </li>
        ))}
      </ul>
    </div>
  );
}
