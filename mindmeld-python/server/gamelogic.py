import random

themes = {
    "animals": ["dog", "cat", "lion", "tiger", "zebra", "elephant"],
    "fruits": ["apple", "banana", "mango", "pear", "grape", "peach"],
    "colors": ["red", "blue", "green", "yellow", "purple", "orange"]
}

def get_theme():
    return random.choice(list(themes.keys()))

def get_word_for_theme(theme):
    return random.choice(themes[theme])

def check_guess(guess, correct_word):
    return guess.strip().lower() == correct_word.strip().lower()
