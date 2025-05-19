import React, { useEffect, useState } from 'react';
import socket from '../socketManager';

const GameRoom = () => {
  const [theme, setTheme] = useState('');
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    socket.on('theme', (newTheme) => {
      setTheme(newTheme);
    });

    socket.on('new_guess', ({ id, word }) => {
      setGuesses((prev) => [...prev, { id, word }]);
    });

    socket.on('match', (matchedWord) => {
      setMatch(matchedWord);
    });

    return () => {
      socket.off('theme');
      socket.off('new_guess');
      socket.off('match');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim()) {
      socket.emit('submit_word', guess);
      setGuess('');
    }
  };

  const handleRestart = () => {
    socket.emit('restart_game');
    setGuesses([]);
    setMatch(null);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">🧠 MindMeld</h1>
      <h2 className="text-lg font-semibold mb-4">
        🎯 Theme: <span className="text-blue-600">{theme}</span>
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter a word..."
          className="flex-grow border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {match && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          🎉 Match found: <strong>{match}</strong>
        </div>
      )}

      <button
        onClick={handleRestart}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        🔄 Restart Game
      </button>

      <ul className="bg-white shadow rounded p-4">
        {guesses.map((g, i) => (
          <li key={i} className="border-b py-1 text-gray-700">
            {g.id.slice(0, 6)}: {g.word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameRoom;
