# TaskAI — AI-Powered Task & Meeting Assistant

A full-stack productivity SaaS built with the MERN stack and OpenAI. Users can manage tasks, log meeting notes, and let AI automatically summarize meetings and generate action items.

---

## Features

- **JWT Authentication** — Access token + Refresh token system with httpOnly cookies
- **Google OAuth 2.0** — Login with Google via Passport.js
- **Task Management** — Create, update, delete, and filter tasks by status and priority
- **Meeting Logs** — Paste meeting notes or transcripts
- **AI Summarization** — GPT-4o summarizes meetings and extracts action items
- **AI Task Generation** — One-click to add AI-suggested tasks to your task list
- **Protected Routes** — All data is user-scoped and secured

---

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT) — Access & Refresh token flow
- Passport.js — Google OAuth 2.0
- OpenAI API — GPT-4o
- bcryptjs — Password hashing
- cookie-parser — httpOnly cookie management

### Frontend
- React + Vite
- React Router DOM
- Axios — with request/response interceptors
- Tailwind CSS v4
- Context API — Global auth state

---

## Project Structure

```
ai-task-assistant/
├── server/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── openai.js             # OpenAI client
│   │   └── passport.js           # Google OAuth strategy
│   ├── controllers/
│   │   ├── authController.js     # register, login, refresh, logout, getMe, googleCallback
│   │   ├── taskController.js     # CRUD for tasks
│   │   └── meetingController.js  # CRUD + AI summarization
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT verify middleware
│   ├── models/
│   │   ├── User.js               # User schema (local + Google auth)
│   │   ├── Task.js               # Task schema
│   │   └── Meeting.js            # Meeting + AI summary schema
│   ├── routes/
│   │   ├── auth.routes.js        # /api/auth
│   │   ├── tasks.routes.js       # /api/tasks
│   │   └── meetings.routes.js    # /api/meetings
│   ├── .env.example
│   └── server.js                 # Entry point
│
└── client/
    └── src/
        ├── api/
        │   └── axios.js          # Axios instance + interceptors
        ├── components/
        │   └── Navbar.jsx
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Tasks.jsx
        │   ├── Meetings.jsx
        │   └── OAuthSuccess.jsx
        └── App.jsx
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works)
- OpenAI API key
- Google Cloud Console project with OAuth 2.0 credentials

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-task-assistant.git
cd ai-task-assistant
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_random_access_secret
REFRESH_TOKEN_SECRET=your_random_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

### 3. Frontend setup

```bash
cd ../client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Routes

### Auth — `/api/auth`

| Method | Route | Description | Protected |
|--------|-------|-------------|-----------|
| POST | `/register` | Register with email & password | No |
| POST | `/login` | Login with email & password | No |
| POST | `/refresh` | Get new access token via refresh token cookie | No |
| POST | `/logout` | Clear refresh token cookie | No |
| GET | `/me` | Get current logged-in user | Yes |
| GET | `/google` | Redirect to Google OAuth | No |
| GET | `/google/callback` | Google OAuth callback | No |

### Tasks — `/api/tasks`

| Method | Route | Description | Protected |
|--------|-------|-------------|-----------|
| GET | `/` | Get all tasks for current user | Yes |
| GET | `/:id` | Get single task | Yes |
| POST | `/` | Create a task | Yes |
| PUT | `/:id` | Update a task | Yes |
| DELETE | `/:id` | Delete a task | Yes |

### Meetings — `/api/meetings`

| Method | Route | Description | Protected |
|--------|-------|-------------|-----------|
| GET | `/` | Get all meetings for current user | Yes |
| GET | `/:id` | Get single meeting | Yes |
| POST | `/` | Create a meeting | Yes |
| POST | `/:id/summarize` | Summarize meeting with AI | Yes |
| POST | `/:meetingId/tasks/:taskIndex` | Add AI-suggested task to task list | Yes |
| DELETE | `/:id` | Delete a meeting | Yes |

---

## Auth Flow

```
Local Signup / Login
  → Password hashed with bcrypt
  → Access token (15min) returned in response
  → Refresh token (7 days) stored in httpOnly cookie

Token Refresh
  → Axios interceptor catches 401 automatically
  → Calls /api/auth/refresh
  → New access token issued silently

Google OAuth
  → User clicks "Continue with Google"
  → Redirected to Google consent screen
  → Callback hits /api/auth/google/callback
  → JWT issued and sent to /oauth-success on frontend
  → Token saved to localStorage
```

---

## AI Flow

```
User creates a meeting and pastes notes
  → Clicks "Summarize with AI"
  → GPT-4o reads the notes
  → Returns a summary + extracted action items with priorities
  → Saved to Meeting document

User reviews AI-suggested tasks
  → Clicks "Add to Tasks" on any item
  → Task created in Task collection with meetingRef
  → Task marked as "AI Generated" in the UI
```

---



---

## Scripts

### Backend
```bash
npm run dev    # Start with nodemon
```

### Frontend
```bash
npm run dev    # Start Vite dev server
npm run build  # Production build
```

---

## Roadmap

- [ ] Email verification on signup
- [ ] Forgot password flow
- [ ] Team collaboration — shared tasks
- [ ] Calendar integration
- [ ] Email reminders for due tasks
- [ ] Deploy — Render (backend) + Vercel (frontend)

---


