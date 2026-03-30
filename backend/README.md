# ⚙️ Echo Backend

This backend powers the Echo application — an AI-driven journaling platform focused on private reflection and emotional insights.

---

## Responsibilities

- 🔐 User Authentication (JWT-based)
- 📝 Journal CRUD operations
- 🤖 AI-powered journal analysis
- 📊 Analytics & insights generation
- 🧠 Weekly reflection engine

---

## Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL (Neon)**
- **Prisma ORM**
- **JWT Authentication**
- **AI Integration (Groq / OpenAI)**

---

## API Overview

### Auth Routes
- `POST /api/auth/register`
- `POST /api/auth/login`

### Journal Routes
- `GET /api/journals`
- `POST /api/journals`
- `PUT /api/journals/:id`
- `DELETE /api/journals/:id`
- `POST /api/journals/:id/analyze`

### Analytics Routes
- `GET /api/analytics/dashboard-summary`
- `GET /api/analytics/mood-trend`
- `GET /api/analytics/weekly-reflection`
- `GET /api/analytics/latest-analysis`

---

## Authentication

- JWT-based authentication
- Protected routes via middleware
- Token required in headers:

```http
Authorization: Bearer <token>