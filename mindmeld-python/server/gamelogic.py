import random

themes = {
    "Space": ["planet", "star", "galaxy", "moon", "rocket"],
    "Food": ["pizza", "burger", "pasta", "salad", "sushi"],
    "Technology": ["computer", "robot", "keyboard", "internet", "software"],
    "Movies": ["comedy", "thriller", "drama", "action", "horror"],
    "Books": ["novel", "poetry", "fiction", "biography", "mystery"],
    "Animals": ["dog", "cat", "lion", "tiger", "zebra", "elephant"],
    "Nature": ["forest", "river", "mountain", "valley", "ocean"],
    "History": ["war", "empire", "revolution", "king", "queen"],
    "Fashion": ["shirt", "dress", "shoes", "hat", "jacket"],
    "Art": ["painting", "sculpture", "drawing", "canvas", "gallery"],
    "Mythology": ["zeus", "hera", "thor", "odin", "athena"],
    "Slang": ["cool", "lit", "chill", "dope", "savage"],
    "Emotions": ["happy", "sad", "angry", "excited", "scared"],
    "Colors": ["red", "blue", "green", "yellow", "purple", "orange"],
    "Travel": ["beach", "hotel", "passport", "plane", "luggage"],
    "Music": ["guitar", "drums", "piano", "violin", "singer"],
    "Careers": ["doctor", "engineer", "teacher", "chef", "artist"],
    "Cities": ["paris", "london", "tokyo", "newyork", "berlin"],
    "Sports": ["soccer", "tennis", "basketball", "cricket", "golf"],
    "Science": ["atom", "energy", "gravity", "cell", "virus"],
    "Hobbies": ["reading", "painting", "gaming", "fishing", "cooking"],
    "Games": ["chess", "poker", "soccer", "minecraft", "fortnite"],
    "Social Media": ["tweet", "post", "like", "share", "follow"],
    "Seasons": ["spring", "summer", "autumn", "winter"],
    "School": ["math", "history", "science", "english", "art"],
    "Superheroes": ["batman", "superman", "wonderwoman", "flash", "ironman"],
    "Dreams": ["flying", "falling", "chasing", "winning", "running"],
    "Magic": ["wand", "spell", "wizard", "potion", "curse"],
    "Vehicles": ["car", "bike", "plane", "train", "boat"],
    "Brands": ["nike", "apple", "adidas", "google", "coca-cola"]
}

current_theme = None
secret_word = None

def pick_new_word():
    global current_theme, secret_word
    current_theme = random.choice(list(themes.keys()))
    secret_word = random.choice(themes[current_theme])
    return current_theme, secret_word

def check_guess(guess, correct_word):
    return guess.strip().lower() == correct_word.strip().lower()
