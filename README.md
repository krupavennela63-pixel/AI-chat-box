<<<<<<< HEAD
# 🤖 PyBot — Rule-Based Chatbot Web Application

A clean, modern, and beginner-friendly **Rule-Based Chatbot web application** built with **Python Flask** for the backend and **HTML5, CSS3, and JavaScript** for the frontend.

---

## ✨ Features

- **Rule-Based Logic:** Evaluates user inputs using keyword matching, loops, and conditional structures.
- **RESTful Flask API:** Communicates seamlessly between frontend and backend via JSON over `/chat`.
- **Modern UI / UX:** 
  - Glassmorphic card design with deep slate dark mode and subtle ambient glow.
  - Interactive quick suggestion chips for one-click questions.
  - Typing indicator animation for a realistic conversation feel.
  - Send messages via the **Send** button or by pressing <kbd>Enter</kbd>.
  - Responsive layout optimized for desktop, tablet, and mobile browsers.
  - Conversation reset / Clear Chat button.

---

## 🧠 Python Programming Concepts Demonstrated

| Concept | Implementation in `app.py` |
| :--- | :--- |
| **Functions** | `clean_user_text()` and `get_bot_response()` encapsulate normalization and response generation. |
| **If-Elif-Else** | Validates empty inputs, handles special queries (e.g., `time`, `date`, `joke`), and falls back to default responses. |
| **Loops** | Nested `for` loops iterate through `RULES` and inspect keyword patterns against user input. |
| **Input / Output** | Receives JSON payload via HTTP POST `/chat`, logs activity to the console, and returns JSON response with timestamps. |
| **Predefined Responses** | A structured dictionary list (`RULES`) mapping categories and keywords to curated answers. |

---

## 💬 Example Interactions

| User Message | Chatbot Response |
| :--- | :--- |
| `hello` or `hi` | *"Hi! Nice to meet you."* |
| `how are you` | *"I'm fine, thanks!"* |
| `what is your name` | *"I'm PyBot, your friendly rule-based assistant!"* |
| `thanks` | *"You're welcome!"* |
| `bye` | *"Goodbye! Have a nice day!"* |
| `what time is it` | *"The current time is HH:MM AM/PM."* |
| *any unknown input* | *"Sorry, I don't understand that."* |

---

## 📁 Project Structure

```
chatbox/
├── app.py                  # Python Flask server & rule-based chatbot engine
├── requirements.txt        # Python dependencies (Flask)
├── README.md               # Documentation and execution guide
├── templates/
│   └── index.html          # Semantic HTML chat interface
└── static/
    ├── style.css           # Modern styling and animations
    └── script.js           # Frontend client & API communication
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.8 or higher installed on your computer.

### 2. Install Dependencies
Open your terminal or command prompt in the project root directory and run:

```bash
pip install -r requirements.txt
```

### 3. Run the Flask Server
Execute the `app.py` script:

```bash
python app.py
```

### 4. Open in Browser
Visit the local server address in your web browser:
```
http://127.0.0.1:5000
```
=======
# AI-chat-box
>>>>>>> b7d9d647916bffb21f61809a4b9a3d29c803fa1b
"# AI-chatbox2" 
