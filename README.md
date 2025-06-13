# 🤖 AI Chatbot with FastAPI and LLaMA (Groq API)


A full-stack intelligent chatbot application powered by FastAPI and a Large Language Model (LLaMA 3.1 via Groq API), with a modern, responsive frontend built in React and styled with Tailwind CSS.

---

## Tech Stack

**Backend**:

* FastAPI (Python)
* LLaMA 3.1 via Groq API
* Pydantic (for schema validation)
* Python OOP for in-memory chat session management

**Frontend**:

* React (Vite setup)
* Tailwind CSS
* Lucide React Icons
* REST API integration with FastAPI backend

---

## Project Objective

> "The goal of this project is to build a lightweight, context-aware AI chatbot API using FastAPI. It allows users to interact with an AI assistant using natural language, while maintaining multi-turn conversation context."


---

## Features

* Real-time conversation with AI assistant
* Context-aware multi-turn interactions
* Responsive modern UI using React and Tailwind
* Clean architecture separating backend logic and frontend UI
* Easily extendable with database, auth, or deployment

---

## Folder Structure

```bash
llm-chatbot/
├── backend/              # FastAPI backend
│   ├── main.py
│   └── utils.py
│   └── models.py
│   └── requirements.txt
├── frontend/             # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│   └── tailwind.config.js
│   └── index.html
└── README.md
```

---

## Installation & Setup

### Backend (FastAPI)

```bash
cd backend
python -m venv chatbot-env
source chatbot-env/bin/activate  # Windows: chatbot-env\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React + Tailwind)

```bash
cd frontend/chatbot-ui
npm install
npm run dev
```

## Acknowledgments

* [FastAPI Docs](https://fastapi.tiangolo.com/)
* [Groq API](https://console.groq.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Lucide Icons](https://lucide.dev/)

---

## License

This project is licensed under the [MIT License](LICENSE).


