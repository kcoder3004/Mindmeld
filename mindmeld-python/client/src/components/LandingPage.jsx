import React from "react";

export default function LandingPage({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6">
      <h1 className="text-6xl font-extrabold mb-8">MindMeld</h1>
      <p className="mb-10 max-w-lg text-center text-lg">
        Guess the secret word before your lives run out. Collaborate with other players and share guesses!
      </p>
      <button
        onClick={onStart}
        className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition"
      >
        Start Game
      </button>
    </div>
  );
}
