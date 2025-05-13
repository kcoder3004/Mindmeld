import React, { useState, useEffect } from 'react';
import socket from '../socketManager';

const GameRoom = () => {
  const [word, setWord] = useState('');
  const [attempts, setAttempts] = useState(10);
  const [history, setHistory] = useState([]);
  const roomCode = 'ROOM123';

  useEffect(() => {
    socket.emit('join-room', roomCode);
    socket.on('word-submitted', ({ word, socketId }) => {
      setHistory((prev) => [...prev, word]);
    });
  }, []);

  const handleSubmit = () => {
    if (word && attempts > 0) {
      socket.emit('submit-word', { roomCode, word });
      setAttempts((a) => a - 1);
      setWord('');
    }
  };

  return (
    <div>
      <h2>MindMeld</h2>
      <p>Theme: Fruits</p>
      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Your word..."
      />
      <button onClick={handleSubmit} disabled={!word || attempts <= 0}>
        Submit
      </button>
      <p>Attempts left: {attempts}</p>
      <ul>
        {history.map((w, i) => <li key={i}>{w}</li>)}
      </ul>
    </div>
  );
};

export default GameRoom;