from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Themes, words and hints
themes = {
    "Space": [
        {"word": "planet", "hint": "Orbits a star"},
        {"word": "star", "hint": "Gives off light"},
        {"word": "galaxy", "hint": "Huge collection of stars"},
        {"word": "moon", "hint": "Orbits a planet"},
        {"word": "rocket", "hint": "Used to launch into space"}
    ],
    "Food": [
        {"word": "pizza", "hint": "Often topped with cheese"},
        {"word": "burger", "hint": "A sandwich with a patty"},
        {"word": "pasta", "hint": "Italian noodles"},
        {"word": "salad", "hint": "Mixed greens and veggies"},
        {"word": "sushi", "hint": "Japanese rice rolls"}
    ],
    "Technology": [
        {"word": "computer", "hint": "Electronic brain"},
        {"word": "robot", "hint": "Automated machine"},
        {"word": "keyboard", "hint": "You type on it"},
        {"word": "internet", "hint": "Global network"},
        {"word": "software", "hint": "Programs and apps"}
    ],
    # Add more themes & words if you want
}

current_theme = None
secret_word = None
secret_hint = None
guesses = {}
lives = {}

MAX_LIVES = 10

def pick_new_word():
    global current_theme, secret_word, secret_hint, guesses, lives
    current_theme = random.choice(list(themes.keys()))
    word_hint_pair = random.choice(themes[current_theme])
    secret_word = word_hint_pair["word"]
    secret_hint = word_hint_pair["hint"]
    guesses = {}
    lives = {}
    print(f"[INFO] New game started - Theme: {current_theme}, Word: {secret_word}, Hint: {secret_hint}")

pick_new_word()

@socketio.on("connect")
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('theme_and_hint', {'theme': current_theme, 'hint': hints.get(secret_word, "No hint available")})


@socketio.on("submit_word")
def handle_word(data):
    sid = request.sid
    guess = data.strip().lower()
    print(f"[GUESS] {sid}: {guess}")

    if sid not in guesses:
        guesses[sid] = []

    if sid not in lives:
        lives[sid] = MAX_LIVES

    # Already guessed this word?
    if guess in guesses[sid]:
        emit("update", {"guesses": guesses, "lives": lives})
        return

    guesses[sid].append(guess)

    if guess == secret_word:
        print(f"[WIN] Player {sid} guessed the word!")
        emit("game_over", {"result": "win", "word": secret_word}, broadcast=True)
    else:
        lives[sid] -= 1
        if lives[sid] <= 0:
            print(f"[LOSE] Player {sid} ran out of lives.")
            emit("game_over", {"result": "lose"}, room=sid)
        else:
            emit("update", {"guesses": guesses, "lives": lives}, broadcast=True)

@socketio.on("restart_game")
def restart_game():
    pick_new_word()
    print("[RESTART] Game restarted by a player")
    emit("game_state", {
        "theme": current_theme,
        "hint": secret_hint,
        "lives": lives,
        "guesses": guesses
    }, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, port=5000, debug=True)
