# LawGenie AI Backend

FastAPI backend for LawGenie AI. This service handles legal chat responses, retrieval/search over indexed legal content, and training pipeline execution.

## Stack

- FastAPI
- Uvicorn
- MongoDB (PyMongo)
- Groq API client
- Sentence Transformers / Torch

## Folder Layout

```text
Backend/
├─ config/            # App settings and env handling
├─ core/              # Chat, query, training, and data logic
├─ middleware/        # JWT and session middleware helpers
├─ routes/            # API route modules
├─ data/              # Local data, logs, and PDF processing support
├─ main.py            # FastAPI app entrypoint
└─ requirements.txt
```

## Prerequisites

- Python 3.10+
- MongoDB (local instance or Atlas)
- Groq API key

## Setup

1. Create and activate virtual environment.

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies.

```bash
pip install -r requirements.txt
```

3. Create `Backend/.env`.

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
GROQ_MAX_COMPLETION_TOKENS=1200
GROQ_REASONING_EFFORT=low

JWT_SECRET_KEY=your_jwt_secret
JWT_ALGO=HS256

MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=lawgenie

MONGO_DOCUMENTS_COLLECTION=documents
MONGO_SESSIONS_COLLECTION=chat_sessions
MONGO_MESSAGES_COLLECTION=chat_messages
MONGO_TRAINING_STATE_COLLECTION=training_state
MONGO_USE_ATLAS_VECTOR_SEARCH=true
MONGO_VECTOR_INDEX_NAME=law_chunks_vector_idx
MONGO_SEARCH_INDEX_NAME=law_chunks_search_idx
MONGO_EMBEDDING_DIMENSIONS=384
MONGO_VECTOR_NUM_CANDIDATES=120

CHAT_TOP_K=3
CHAT_MAX_HISTORY_TURNS=6
CHAT_ENABLE_BROWSER_SEARCH=false
CHAT_EXPIRY_TIME=86400
```

## Run

```bash
uvicorn main:app --reload
```

API docs:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## API Routes

- `GET /chat/?q=<query>`: Generate AI legal response and update history
- `GET /chat/history`: Return history for authenticated token
- `GET /search/?q=<query>&top_k=5&mode=auto`: Search indexed legal content
- `POST /train/`: Trigger ingestion/training process

## Notes

- CORS is configured in `main.py` for local frontend origins.
- Chat route supports bearer token session continuity.
- Keep production secrets out of source control.
