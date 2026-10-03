"""
Rule-Based Chatbot Web Application
Backend: Python Flask (Vercel-compatible entry point)
Frontend: HTML, CSS, JavaScript

Demonstrates fundamental Python programming concepts:
1. Functions (modular code structure)
2. If-Elif-Else statements (conditional decision making)
3. Loops (iterating over rule sets and keywords)
4. Input / Output (processing HTTP JSON requests and returning structured JSON)
5. Predefined Responses (rule-based pattern matching)
"""

import re
import os
import sys
from datetime import datetime
from flask import Flask, render_template, request, jsonify

# Ensure terminal doesn't crash on emoji characters in stdout
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Initialize Flask application
# Tell Flask where to find templates and static files (one level up from api/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
)

# ==============================================================================
# CONCEPT 5: PREDEFINED RESPONSES & RULE SETS
# A list of dictionaries containing keyword patterns and corresponding answers.
# ==============================================================================
RULES = [
    {
        "category": "greetings",
        "keywords": ["hello", "hi", "hey", "good morning", "good evening", "greetings"],
        "response": "Hi! Nice to meet you."
    },
    {
        "category": "status",
        "keywords": ["how are you", "how are you doing", "how are u", "how do you do"],
        "response": "I'm fine, thanks!"
    },
    {
        "category": "identity",
        "keywords": ["what is your name", "whats your name", "who are you", "your name"],
        "response": "I'm PyBot, your friendly rule-based assistant!"
    },
    {
        "category": "gratitude",
        "keywords": ["thanks", "thank you", "thx", "appreciate it"],
        "response": "You're welcome!"
    },
    {
        "category": "farewell",
        "keywords": ["bye", "goodbye", "see you", "cya", "have a nice day"],
        "response": "Goodbye! Have a nice day!"
    },
    {
        "category": "help",
        "keywords": ["help", "what can you do", "commands", "options"],
        "response": "You can ask me: 'hello', 'how are you', 'what is your name', 'time', 'joke', 'thanks', or 'bye'."
    }
]


# ==============================================================================
# CONCEPT 1: FUNCTIONS
# Modular helper functions for cleaning text and determining bot responses.
# ==============================================================================
def clean_user_text(raw_text: str) -> str:
    """
    Cleans and normalizes user input.
    - Converts to lowercase.
    - Strips whitespace.
    - Removes punctuation for consistent matching.
    """
    if not raw_text:
        return ""
    # Lowercase and trim outer whitespace
    lowered = raw_text.lower().strip()
    # Remove punctuation marks (e.g., 'hello!' -> 'hello')
    cleaned = re.sub(r"[^\w\s]", "", lowered)
    return cleaned


def get_bot_response(user_message: str) -> str:
    """
    Evaluates user input using:
    - Input validation
    - If-Elif-Else statements (Concept 2)
    - Loops over predefined rules (Concept 3)
    - Fallback default response
    """
    cleaned_message = clean_user_text(user_message)

    # --------------------------------------------------------------------------
    # CONCEPT 2: IF-ELIF-ELSE LOGIC
    # Handles empty input, special interactive queries, and edge cases.
    # --------------------------------------------------------------------------
    if not cleaned_message:
        return "Please enter a message so we can chat!"

    # Special dynamic features using if-elif-else
    elif cleaned_message in ["time", "what time is it", "current time"]:
        current_time = datetime.now().strftime("%I:%M %p")
        return f"The current time is {current_time}."

    elif cleaned_message in ["date", "what is today", "what day is it"]:
        today_date = datetime.now().strftime("%A, %B %d, %Y")
        return f"Today is {today_date}."

    elif "joke" in cleaned_message:
        return "Why do Python programmers prefer dark mode? Because light attracts bugs! 🐛"

    # --------------------------------------------------------------------------
    # CONCEPT 3: LOOPS
    # Loop through the list of predefined rules and check each keyword list.
    # --------------------------------------------------------------------------
    for rule in RULES:
        for keyword in rule["keywords"]:
            # Check if keyword is in the cleaned message
            if keyword in cleaned_message:
                return rule["response"]

    # --------------------------------------------------------------------------
    # FALLBACK (When no predefined rule matches)
    # --------------------------------------------------------------------------
    return "Sorry, I don't understand that."


# ==============================================================================
# CONCEPT 4: INPUT / OUTPUT VIA FLASK API ENDPOINTS
# Serving HTML frontend and processing JSON API requests.
# ==============================================================================
@app.route("/")
def home():
    """Renders the main chat interface."""
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    """
    API endpoint for handling chat messages.
    Receives JSON: {"message": "user text here"}
    Returns JSON:  {"response": "bot reply", "timestamp": "6:05 PM"}
    """
    data = request.get_json(silent=True)

    # Validate incoming JSON
    if not data or "message" not in data:
        return jsonify({
            "response": "Invalid request. Please provide a message.",
            "status": "error"
        }), 400

    user_text = data.get("message", "")
    print(f"[INPUT] User says: {user_text}")

    # Generate chatbot response
    bot_reply = get_bot_response(user_text)
    print(f"[OUTPUT] Bot replies: {bot_reply}")

    current_timestamp = datetime.now().strftime("%I:%M %p")

    return jsonify({
        "response": bot_reply,
        "timestamp": current_timestamp,
        "status": "success"
    })


# Vercel requires the app object to be importable — no app.run() needed
# Local dev fallback only
if __name__ == "__main__":
    print("\n" + "=" * 50)
    print(" [BOT] Rule-Based Chatbot is running!")
    print(" [URL] Access the chat app at: http://127.0.0.1:5000")
    print("=" * 50 + "\n")
    app.run(debug=True, host="127.0.0.1", port=5000)
