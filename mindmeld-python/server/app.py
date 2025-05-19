from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import gamelogic

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

guesses = {}

def log_state():
    print(f"Current theme: {gamelogic.current_theme}")
    print(f"Secret word: {gamelogic.secret_word}")
    print(f"Guesses so far: {guesses}")

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    # On connect, send current theme
    emit('theme', gamelogic.current_theme)
    log_state()

@socketio.on('submit_word')
def handle_word(data):
    sid = request.sid
    guess = data.strip().lower()
    print(f"Received guess from {sid}: {guess}")
    if sid not in guesses:
        guesses[sid] = []
    guesses[sid].append(guess)

    if gamelogic.check_guess(guess, gamelogic.secret_word):
        print(f"Match found! Player {sid} guessed the secret word: {guess}")
        emit('match', {'word': guess, 'player': sid}, broadcast=True)
    else:
        emit('new_guess', {'id': sid, 'word': guess}, broadcast=True)
    
    log_state()

@socketio.on('restart_game')
def restart_game():
    global guesses
    print(f"Game restart requested by {request.sid}")
    guesses.clear()
    gamelogic.pick_new_word()
    emit('theme', gamelogic.current_theme, broadcast=True)
    log_state()

if __name__ == '__main__':
    gamelogic.pick_new_word()
    print(f"Starting server with theme: {gamelogic.current_theme} and word: {gamelogic.secret_word}")
    socketio.run(app, port=5000)
