# LawGenie AI Frontend

React + Vite frontend for LawGenie AI. This app provides the UI for legal chat, message history, and interaction with backend chat/search services.

## Stack

- React 19
- Vite 7
- Tailwind CSS 4
- React Router 7
- Axios

## Folder Layout

```text
Frontend/
├─ public/
├─ src/
│  ├─ api/             # HTTP wrappers
│  ├─ components/      # Reusable UI components
│  ├─ config/          # Frontend env config
│  ├─ constants/       # Static messages and rules
│  ├─ hooks/           # Custom hooks
│  ├─ layouts/         # Shared layout
│  ├─ pages/           # Route pages
│  └─ services/        # Chat/search service calls
├─ index.html
├─ package.json
└─ vite.config.js
```

## Prerequisites

- Node.js 20+
- npm 10+
- Running backend API

## Setup

1. Install dependencies.

```bash
npm install
```

2. Create `Frontend/.env`.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Run

```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production assets
- `npm run preview`: Preview production build
- `npm run lint`: Run lint checks

## API Integration

Expected backend endpoints:

- `GET /chat/?q=...`
- `GET /chat/history`
- `GET /search/?q=...&top_k=5&mode=auto`
- `POST /train/`

Authorization header used when token exists:

```http
Authorization: Bearer <token>
```

## Notes

- If backend is unavailable, chat UI displays a fallback error message.
- Ensure `VITE_API_BASE_URL` points to the running backend instance.
