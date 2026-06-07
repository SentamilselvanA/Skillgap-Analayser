# 🚀 SkillNova: Advanced Skill-Gap Analyzer

**SkillNova** is a premium, full-stack career development platform designed to help professionals navigate their career growth. By leveraging data-driven insights and personalized learning roadmaps, SkillNova identifies the exact distance between your current expertise and your dream role.

![SkillNova Hero Illustration](file:///C:/Users/Work/.gemini/antigravity/brain/52a7b923-d8df-4e44-be4b-5a117b0977ed/landing_hero_illustration_1777995221034.png)

---

## ✨ Core Features

### 🔍 Precision Analysis
- **Role Analyzer**: Compare your current skills against pre-defined industry standards for top tech roles.
- **Job Description (JD) Analyzer**: Paste any job description to instantly extract required competencies and calculate your match score.
- **Gap Identification**: Visual breakdowns of matched and missing skills with weighted scoring.

### 🗺️ Dynamic Roadmaps
- **Personalized Learning**: Get a structured roadmap for every missing skill identified.
- **Resource Integration**: Direct links to documentation and learning materials for rapid skill acquisition.

### 👤 Profile & Inventory
- **Global Skills Sync**: Manage your professional inventory in one place. Your data stays in sync across the entire platform.
- **Progress Tracking**: Save analysis results to your history to track your growth over time.

### 🎨 Premium Experience
- **State-of-the-Art UI**: A sleek, high-tech aesthetic with glassmorphism and modern micro-animations.
- **Theme Engine**: Seamless switching between Dark and Light modes with persistent user preferences.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (Vanilla CSS for custom components)
- **State Management**: React Context API (Auth, Theme, Skills)
- **Routing**: React Router DOM v6

### Backend
- **Environment**: Node.js & Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt hashing

---

## 📂 Project Structure

```text
├── backend/
│   ├── controllers/    # API Business Logic (Auth, Skills, Analysis)
│   ├── db/             # Database Connection & Initialization
│   ├── middleware/     # Auth Guards & Error Handling
│   ├── routes/         # API Endpoint Definitions
│   └── server.js       # Express Server Entry Point
└── src/
    ├── components/     # Reusable, Theme-Aware UI Components
    ├── context/        # Global State Providers
    ├── data/           # Mock Roles and Static Data
    ├── pages/          # Main Application Views (Landing, Analyzer, Profile, etc.)
    ├── utils/          # API Client & Helper Functions
    └── App.jsx         # Main Router & Provider Tree
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** (Running locally or on a cloud provider)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Skillgap-Analayser
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup**
   - Navigate to the backend folder: `cd backend`
   - Install dependencies: `npm install`
   - Create a `.env` file based on `.env.example`:
     ```env
     PORT=5000
     DATABASE_URL=your database url
     JWT_SECRET=your_super_secret_key
     ```
   - Start the server: `npm run dev`

---


