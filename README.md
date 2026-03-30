# 🌿 Echo — AI-Powered Reflection Journal

Echo is a full-stack AI-powered journaling application that helps users capture thoughts, understand emotional patterns, and receive meaningful insights — privately and securely.

> Built as a real-world full-stack application with authentication, AI integration, and cloud deployment.

---

## 🚀 Live Demo

- 🌐 Frontend: https://your-vercel-url.vercel.app  
- ⚙️ Backend API: https://echo-journal.onrender.com  

---

## 🧠 What is Echo?

Echo is a **private reflection tool**, not a social platform.

It enables users to:
- Write journals consistently
- Analyze emotional tone using AI
- Identify patterns over time
- Reflect without noise or judgment

---

## ❗ Problem

Journaling is powerful but often difficult to maintain:

- Unstructured writing  
- Hard to track emotional trends  
- Existing tools feel social or clinical  

---

## 💡 Solution

Echo combines:

- ✍️ Simple journaling  
- 🤖 AI-powered analysis  
- 📊 Insightful analytics  

To create a **clear, personal reflection experience**.

---

## ✨ Features

### 🔐 Authentication
- Secure JWT-based login & signup
- Protected routes

### 📝 Journaling
- Create, edit, delete entries
- Clean UI with inline editing

### 🤖 AI Analysis
- Mood detection
- Emotional scoring (0–10)
- Reflection prompts
- Pattern recognition

### 📊 Analytics Dashboard
- Total journals & analyses
- Average mood score
- Mood trend chart

### 🧠 Weekly Reflection
- AI-generated insights from user activity
- Recurring themes + action steps

---

## 🏗️ Tech Stack

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- Recharts

### Backend
- Node.js + Express
- Prisma ORM

### Database
- PostgreSQL (Neon)

### Auth
- JWT Authentication

### AI
- LLM-based analysis (Groq / OpenAI)

### Deployment
- Frontend → Vercel  
- Backend → Render  
- Database → Neon  

---

## 🧩 Architecture
# 🌿 Echo — AI-Powered Reflection Journal

Echo is a full-stack AI-powered journaling application that helps users capture thoughts, understand emotional patterns, and receive meaningful insights — privately and securely.

> Built as a real-world full-stack application with authentication, AI integration, and cloud deployment.

---

## 🚀 Live Demo

- 🌐 Frontend: https://your-vercel-url.vercel.app  
- ⚙️ Backend API: https://echo-journal.onrender.com  

---

## 🧠 What is Echo?

Echo is a **private reflection tool**, not a social platform.

It enables users to:
- Write journals consistently
- Analyze emotional tone using AI
- Identify patterns over time
- Reflect without noise or judgment

---

## ❗ Problem

Journaling is powerful but often difficult to maintain:

- Unstructured writing  
- Hard to track emotional trends  
- Existing tools feel social or clinical  

---

## 💡 Solution

Echo combines:

- ✍️ Simple journaling  
- 🤖 AI-powered analysis  
- 📊 Insightful analytics  

To create a **clear, personal reflection experience**.

---

## ✨ Features

### 🔐 Authentication
- Secure JWT-based login & signup
- Protected routes

### 📝 Journaling
- Create, edit, delete entries
- Clean UI with inline editing

### 🤖 AI Analysis
- Mood detection
- Emotional scoring (0–10)
- Reflection prompts
- Pattern recognition

### 📊 Analytics Dashboard
- Total journals & analyses
- Average mood score
- Mood trend chart

### 🧠 Weekly Reflection
- AI-generated insights from user activity
- Recurring themes + action steps

---

## 🏗️ Tech Stack

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- Recharts

### Backend
- Node.js + Express
- Prisma ORM

### Database
- PostgreSQL (Neon)

### Auth
- JWT Authentication

### AI
- LLM-based analysis (Groq / OpenAI)

### Deployment
- Frontend → Vercel  
- Backend → Render  
- Database → Neon  

---

## 🧩 Architecture
Frontend (Vercel)
↓
Backend API (Render)
↓
Database (Neon PostgreSQL)

---

## ⚙️ Local Setup

```bash
# Clone repo
git clone https://github.com/your-username/echo-journal.git

# Backend
cd backend
npm install
npx prisma db push
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev

## 🔐 Environment Variables
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key

## Key Learnings
Handling authentication using JWT
Debugging production vs local environment issues
Integrating Prisma with a cloud database (Neon)
Managing full-stack deployment (Vercel + Render)
Structuring scalable APIs and controllers
Designing clean and functional UI/UX


## Future Improvements
🎤 Voice journaling (speech-to-text)
📈 Advanced analytics dashboard
🔐 End-to-end encryption
🧠 Improved AI personalization


👨‍💻 Author
Manoj Kumar Basty
Final Year Computer Science Engineering Student

Focused on:

Full-stack development
AI-integrated applications
Building meaningful user experiences

⚠️ Disclaimer

Echo is not a mental health diagnosis or therapy tool.
It is intended solely for personal reflection.