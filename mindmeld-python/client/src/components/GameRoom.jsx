import React, { useState } from "react";

export default function GameRoom({ theme, guesses, matchWord, onSubmit, onRestart, socketId }) {
  const [input, setInput] = useState("");

  function submitGuess() {
    if (!input.trim()) return;
    onSubmit(input.trim());
    setInput("");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-3xl font-semibold mb-4">Theme: <span className="text-blue-600">{theme}</span></h2>

      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your guess"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitGuess()}
        />
        <button
          onClick={submitGuess}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {matchWord && (
        <div className="p-4 mb-4 bg-green-100 text-green-800 rounded font-semibold">
          🎉 Match found: <span className="underline">{matchWord}</span>
        </div>
      )}

      <button
        onClick={onRestart}
        className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
      >
        Restart Game
      </button>

      <h3 className="text-xl font-medium mb-2">Guesses so far:</h3>
      <ul className="list-disc pl-5 max-h-64 overflow-y-auto">
        {guesses.map(({ id, word }, i) => (
          <li key={i} className={id === socketId ? "font-bold" : ""}>
            {id === socketId ? "You" : "Player"} guessed: {word}
          </li>
        ))}
      </ul>
    </div>
  );
}
