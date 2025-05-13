from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

themes = [
    "Space", "Food", "Technology", "Movies", "Books",
    "Animals", "Nature", "History", "Fashion", "Art",
    "Mythology", "Slang", "Emotions", "Colors", "Travel",
    "Music", "Careers", "Cities", "Sports", "Science",
    "Hobbies", "Games", "Social Media", "Seasons", "School",
    "Superheroes", "Dreams", "Magic", "Vehicles", "Brands"
]

guesses = {}

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    theme = random.choice(themes)
    emit('theme', theme)

@socketio.on('submit_word')
def handle_word(data):
    sid = request.sid
    word = data.strip().lower()
    if sid not in guesses:
        guesses[sid] = []
    guesses[sid].append(word)

    # Compare with other players
    for other_sid, words in guesses.items():
        if other_sid != sid and word in words:
            emit('match', word, broadcast=True)
            return

    emit('new_guess', {'id': sid, 'word': word}, broadcast=True)

@socketio.on('restart_game')
def restart_game():
    guesses.clear()
    theme = random.choice(themes)
    emit('theme', theme, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, port=5000)