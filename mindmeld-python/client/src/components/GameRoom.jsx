import React, { useState, useEffect, useRef } from "react";
import socket from "../socketManager";
import Confetti from "react-confetti";

const MAX_LIVES = 10;

export default function GameRoom() {
  const [theme, setTheme] = useState("Loading...");
  const [hint, setHint] = useState("Loading...");
  const [lives, setLives] = useState(MAX_LIVES);
  const [guesses, setGuesses] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
  socket.on("theme_and_hint", ({ theme, hint }) => {
    setTheme(theme);
    setHint(hint);
    setIsGameStarted(true);
  });

  // Cleanup
  return () => {
    socket.off("theme_and_hint");
  };
}, []);

    socket.on("game_state", (data) => {
      setTheme(data.theme);
      setHint(data.hint);
      setLives(data.lives ?? MAX_LIVES);
      setGuesses(data.guesses ?? {});
      setMessages([]);
      setGameOver(false);
      setWin(false);
    });

    socket.on("update", (data) => {
      setGuesses(data.guesses ?? {});
      if (data.lives) {
        setLives(data.lives[socket.id] ?? MAX_LIVES);
      }
    });

    socket.on("game_over", (data) => {
      if (data.result === "win") {
        setWin(true);
        setMessages((prev) => [...prev, `🎉 Player guessed the word: "${data.word}"!`]);
        setGameOver(true);
      } else if (data.result === "lose") {
        setGameOver(true);
        setMessages((prev) => [...prev, `💀 You ran out of lives! Game over.`]);
      }
    });

    return () => {
      socket.off("game_state");
      socket.off("update");
      socket.off("game_over");
    };
  }, []);

  const sendGuess = () => {
    if (!input.trim() || gameOver) return;
    socket.emit("submit_word", input);
    setInput("");
    inputRef.current.focus();
  };

  const restartGame = () => {
    socket.emit("restart_game");
    setInput("");
    setMessages([]);
    setGameOver(false);
    setWin(false);
    inputRef.current.focus();
  };

  // Hearts with color based on lives left
  const hearts = [];
  for (let i = 0; i < MAX_LIVES; i++) {
    if (i < lives) {
      hearts.push(
        <span key={i} className="text-red-500 text-3xl animate-pulse select-none">
          ♥
        </span>
      );
    } else {
      hearts.push(
        <span key={i} className="text-gray-400 text-3xl select-none">
          ♥
        </span>
      );
    }
  }

  const renderGuesses = () => {
    if (!guesses || Object.keys(guesses).length === 0) return <p>No guesses yet.</p>;
    return Object.entries(guesses).map(([playerId, guessesList]) => (
      <div key={playerId} className="mb-2 break-words">
        <strong>Player {playerId.substring(0, 5)}:</strong> {guessesList.join(", ")}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-600 flex flex-col items-center p-6 text-white select-none">
      {win && <Confetti numberOfPieces={400} recycle={false} />}
      <h1 className="text-5xl font-bold mb-6">MindMeld Game</h1>
      <div className="mb-3 text-2xl">
        <span className="font-semibold underline">Theme:</span> {theme}
      </div>
      <div className="mb-6 text-xl italic max-w-xl text-center">💡 Hint: {hint}</div>
      <div className="mb-6 flex justify-center space-x-1">{hearts}</div>

      <div className="flex w-full max-w-md mb-6">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your guess"
          className="flex-grow px-4 py-3 rounded-l-md border-none outline-none text-black font-semibold"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={gameOver}
          onKeyDown={(e) => e.key === "Enter" && sendGuess()}
          autoFocus
        />
        <button
          onClick={sendGuess}
          disabled={gameOver}
          className={`px-5 py-3 rounded-r-md font-bold transition ${
            gameOver ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-900"
          }`}
        >
          Guess
        </button>
      </div>

      <button
        onClick={restartGame}
        className="mb-8 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg shadow-lg"
      >
        Restart Game
      </button>

      <div className="w-full max-w-lg bg-white bg-opacity-30 rounded-lg p-6 max-h-96 overflow-auto text-black font-mono">
        <h2 className="font-semibold mb-3 text-xl underline">Guesses:</h2>
        {renderGuesses()}
        {messages.length > 0 && (
          <div className="mt-4 text-indigo-900 italic space-y-2">
            {messages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}
      </div>

      {gameOver && !win && (
        <div className="mt-8 text-3xl font-extrabold text-red-700 select-text">
          You lost! Better luck next time.
        </div>
      )}
    </div>
  );
}
