from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from gamelogic import get_theme, get_word_for_theme, check_guess

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Game state
current_theme = None
secret_word = None
guesses = {}

@socketio.on('connect')
def handle_connect():
    global current_theme, secret_word
    if current_theme is None:
        current_theme = get_theme()
        secret_word = get_word_for_theme(current_theme)
        print(f"New game started! Theme: {current_theme}, Word: {secret_word}")

    emit('theme', current_theme)

@socketio.on('submit_word')
def handle_word(data):
    sid = request.sid
    word = data.strip().lower()

    if sid not in guesses:
        guesses[sid] = []

    guesses[sid].append(word)

    # Check if guess matches the secret word
    if check_guess(word, secret_word):
        emit('correct_guess', {'word': word, 'player': sid}, broadcast=True)
        print(f"Player {sid} guessed the secret word: {word}")
        return

    # Check for matching guesses with other players
    for other_sid, words in guesses.items():
        if other_sid != sid and word in words:
            emit('match', {'word': word, 'players': [sid, other_sid]}, broadcast=True)
            print(f"Match found for word '{word}' between {sid} and {other_sid}")
            return

    # If no match or correct guess, emit new guess
    emit('new_guess', {'id': sid, 'word': word}, broadcast=True)

@socketio.on('restart_game')
def restart_game():
    global current_theme, secret_word, guesses
    guesses.clear()
    current_theme = get_theme()
    secret_word = get_word_for_theme(current_theme)
    print(f"Game restarted! New Theme: {current_theme}, Word: {secret_word}")
    emit('theme', current_theme, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, port=5000)
