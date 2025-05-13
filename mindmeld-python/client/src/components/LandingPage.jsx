import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const handleStart = () => navigate('/room');

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-indigo-100 to-purple-200">
      <h1 className="text-5xl font-bold mb-6">🧠 MindMeld</h1>
      <p className="text-lg mb-6">Try to guess the same word as your friend in 10 tries or less!</p>
      <button
        onClick={handleStart}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg"
      >
        Start Game
      </button>
    </div>
  );
}