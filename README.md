# ResumeAI 🚀

An AI-powered platform that analyzes your resume and generates personalized interview questions with detailed reports.

## Live Demo

- **Frontend:** [resume-genai-phi.vercel.app](https://resume-genai-phi.vercel.app)
- **Backend:** [resume-analyzer-wgah.onrender.com](https://resume-analyzer-wgah.onrender.com)

---

## Features

- 📄 **Resume Upload & Analysis** — Upload your resume and get instant AI-powered feedback
- 🤖 **AI Interview Questions** — Get personalized interview questions based on your resume
- 📊 **Interview Report** — Detailed report with scores and suggestions
- 🔐 **User Authentication** — Secure login/register with JWT and cookie-based auth

---

## Tech Stack

### Frontend
- React + Vite
- Axios (API calls)
- Deployed on **Vercel**

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Google Gemini AI
- Deployed on **Render**

---

## Project Structure

```
GENAI/
├── frontend/          # React + Vite app
│   ├── src/
│   └── index.html
└── backend/           # Node.js + Express API
    ├── server.js
    └── src/
        ├── app.js
        ├── controllers/
        ├── routes/
        ├── models/
        ├── middlewares/
        └── services/
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone the repo**
```bash
git clone https://github.com/VarunRawat22/resume-genai.git
cd resume-genai
```

2. **Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

```bash
node server.js
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/auth/get-me` | Get current user |
| POST | `/api/interview/...` | Generate interview report |

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GEMINI_API_KEY` | Google Gemini AI API key |

---

## Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com) from the `frontend/` directory
- **Backend** is deployed on [Render](https://render.com) from the `backend/` directory with start command `node server.js`

---

## Author

**Varun Rawat** — [GitHub](https://github.com/VarunRawat22)
