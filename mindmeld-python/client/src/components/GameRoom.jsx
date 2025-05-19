import React, { useState, useEffect } from "react";
import socket from "../socketManager";

export default function GameRoom({ onLeave }) {
  const [theme, setTheme] = useState("");
  const [guesses, setGuesses] = useState([]); // {id, word}
  const [input, setInput] = useState("");
  const [match, setMatch] = useState(null); // { word, player }
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    socket.on("theme", (newTheme) => {
      setTheme(newTheme);
      setGuesses([]);
      setMatch(null);
      setDisabled(false);
    });

    socket.on("new_guess", (data) => {
      setGuesses((prev) => [...prev, data]);
    });

    socket.on("match", (data) => {
      setMatch(data);
      setDisabled(true);
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      socket.off("theme");
      socket.off("new_guess");
      socket.off("match");
    };
  }, []);

  function submitGuess(e) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    socket.emit("submit_word", input.trim());
    setInput("");
  }

  function restartGame() {
    socket.emit("restart_game");
  }

  return (
    <div className="game-room">
      <h2>Theme: {theme}</h2>
      {match ? (
        <div className="match-message">
          🎉 Player {match.player} guessed the word "{match.word}" correctly!
        </div>
      ) : (
        <form onSubmit={submitGuess}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your guess"
            disabled={disabled}
            autoFocus
          />
          <button type="submit" disabled={disabled || !input.trim()}>
            Guess
          </button>
        </form>
      )}
      <button onClick={restartGame}>Restart Game</button>

      <div className="guess-list">
        <h3>Guesses:</h3>
        {guesses.length === 0 && <p>No guesses yet</p>}
        <ul>
          {guesses.map(({ id, word }, idx) => (
            <li key={idx}>
              Player {id.substring(0, 5)} guessed: {word}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onLeave}>Leave Game</button>
    </div>
  );
}
