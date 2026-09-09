# 🚀 SkillNova — AI-Powered Skill Gap Analyzer

**SkillNova** is a full-stack career development platform that helps professionals identify the exact gap between their current skills and their target role. Upload your resume, let Groq AI extract your skills, then instantly compare against any job description or industry role.

---

## ✨ Features

### 🤖 AI Resume Parsing
- Upload a **PDF, DOCX, or TXT** resume and let **Groq AI** automatically detect and categorize your technical skills
- Paste resume text directly for instant analysis
- AI assigns proficiency levels (Beginner / Intermediate / Advanced) from context
- Review detected skills and selectively import them into your profile

### 🔍 Skill Gap Analysis
- **Role Analyzer** — Compare your skills against pre-built profiles for top tech roles (Frontend Dev, Data Scientist, DevOps, etc.)
- **JD Analyzer** — Paste any job description to extract required skills and get a match score
- **Gap Report** — Visual breakdown of matched vs. missing skills with weighted scoring

### 🗺️ Learning Roadmaps
- Auto-generated, step-by-step learning paths for every skill gap identified
- Curated resource links for rapid upskilling

### 👤 Profile & History
- Persistent skills inventory synced across the entire platform
- Save analysis results to your account history and track progress over time
- Admin dashboard for user management

### 🎨 Premium UI
- Dark / Light theme with smooth transitions
- Glassmorphism, micro-animations, and responsive layouts

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite, React Router v6, Vanilla CSS |
| **State** | React Context API (Auth, Theme, Skills) |
| **Backend** | Node.js, Express |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs |
| **AI / NLP** | [Groq SDK](https://console.groq.com) (LLaMA / Mixtral models) |
| **File Parsing** | pdf-parse, mammoth (DOCX) |

---

## 📂 Project Structure

```text
Skillgap-Analayser/
├── backend/
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── skillsController.js   # Resume upload & skill CRUD
│   │   ├── analysisController.js
│   │   └── adminController.js
│   ├── db/                  # MongoDB connection
│   ├── middleware/          # JWT auth guard
│   ├── models/              # Mongoose schemas (User, Skill, AnalysisResult)
│   ├── routes/              # Express routers
│   │   ├── auth.js
│   │   ├── skills.js        # /upload-resume, /parse-text
│   │   ├── analysis.js
│   │   ├── admin.js
│   │   └── health.js
│   ├── utils/
│   │   ├── groqAnalyzer.js  # Groq AI integration (auto model selection)
│   │   ├── pdfExtractor.js  # Robust PDF text extraction
│   │   └── extractSkills.js
│   ├── server.js
│   ├── .env                 # 🔒 Not committed
│   └── .env.example
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ResumeUploadCard.jsx   # AI resume upload UI
        │   ├── SkillTagInput.jsx
        │   ├── SummaryReport.jsx
        │   ├── Roadmap.jsx
        │   └── ProgressBar.jsx
        ├── context/          # AuthContext, ThemeContext, SkillsContext
        ├── data/             # Role definitions & static data
        ├── pages/
        │   ├── Landing.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Profile.jsx        # Skills inventory + resume upload
        │   ├── Analyzer.jsx       # Role-based gap analysis
        │   ├── JDAnalyzer.jsx     # Job description analyzer
        │   ├── RoleCompare.jsx
        │   ├── Jobs.jsx
        │   ├── JobDetails.jsx
        │   └── AdminDashboard.jsx
        ├── utils/api.js      # Fetch wrapper + all API calls
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on port `27017` (or a MongoDB Atlas URI)
- **Groq API Key** — free at [console.groq.com/keys](https://console.groq.com/keys)

---

### 1. Clone the repo

```bash
git clone <repository-url>
cd Skillgap-Analayser
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file (copy from `.env.example`):

```env
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/skillgap

# JWT — use a long random string in production
JWT_SECRET=your_super_secret_jwt_key

# Server port
PORT=5000

# Frontend origin (for CORS)
FRONTEND_URL=http://localhost:5173

# Groq AI — get a free key from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here
```

Start the backend:

```bash
npm run dev        # development (nodemon, auto-reload)
# or
npm start          # production
```

The API will be available at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> The frontend proxies all `/api` requests to `http://localhost:5000` via Vite's dev server config.

---

## 📡 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login, returns JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user |
| `GET` | `/api/skills` | ✅ | List user's skills |
| `POST` | `/api/skills` | ✅ | Add a single skill |
| `POST` | `/api/skills/batch` | ✅ | Add multiple skills |
| `PUT` | `/api/skills` | ✅ | Bulk replace all skills |
| `DELETE` | `/api/skills/:id` | ✅ | Delete a skill |
| `POST` | `/api/skills/upload-resume` | ✅ | Upload PDF/DOCX/TXT, AI extracts skills |
| `POST` | `/api/skills/parse-text` | — | Parse pasted resume text |
| `GET` | `/api/analysis` | ✅ | Get analysis history |
| `POST` | `/api/analysis` | ✅ | Save an analysis result |
| `DELETE` | `/api/analysis/:id` | ✅ | Delete an analysis record |
| `GET` | `/api/admin/users` | 🔐 Admin | List all users |
| `GET` | `/api/admin/stats` | 🔐 Admin | Platform statistics |
| `GET` | `/api/health` | — | Health check |

---

## 🔑 Groq AI — Model Auto-Selection

The backend automatically queries your Groq account to discover available models at startup, then selects the best one from a preference list:

```
llama3-70b-8192 → llama3-8b-8192 → llama-3.1-70b-versatile → mixtral-8x7b-32768 → ...
```

This means the app works with any Groq API key regardless of which models are available on your plan — no manual configuration needed.

---

## 📄 License

MIT
