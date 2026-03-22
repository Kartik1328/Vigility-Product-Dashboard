# 📊 Vigility Product Analytics Dashboard

A full-stack, self-referential analytics dashboard — it tracks its own usage. Every filter change and chart interaction is recorded as an event and fed back into the visualizations.

**Live Demo:** [https://product-tracking-dashboard.netlify.app](https://product-tracking-dashboard.netlify.app)  
**Backend API:** [https://product-tracker-dashboard.onrender.com](https://product-tracker-dashboard.onrender.com)

---

## Project Structure

```
Vigility-Product-Dashboard/
├── backend/                  # Node.js + Express + Prisma + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma     # Database models
│   │   └── seed.js           # Dummy data seeding script
│   ├── src/
│   │   ├── constants/        # Centralised messages and enums
│   │   ├── controllers/      # Request/response handlers
│   │   ├── middlewares/      # Auth, validation, error handling
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic + Prisma queries
│   │   ├── utils/            # Helper functions
│   │   ├── validations/      # Joi validation schemas
│   │   └── index.js          # App entry point
│   └── package.json
│
├── frontend/                 # React + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── api/              # Axios instance with interceptors
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page-level components
│   │   ├── store/            # Zustand state management
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Cookie helpers
│   └── package.json
│
├── render.yaml               # Render deployment config
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS v3, Recharts, Zustand |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | PostgreSQL (Neon — cloud hosted) |
| Auth | JWT + bcryptjs |
| Validation | Joi |
| Deployment | Netlify (frontend), Render (backend), Neon (database) |

---

## Running Locally

### Prerequisites
- Node.js v18+
- PostgreSQL running locally (or a Neon account)
- Git

---

### 1. Clone the repository
```bash
git clone https://github.com/Kartik1328/Vigility-Product-Dashboard.git
cd Vigility-Product-Dashboard
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vigility_dashboard"
JWT_SECRET="your_secret_key_here"
FRONTEND_URL="http://localhost:5173"
PORT=5000
NODE_ENV="development"
```

Create the database (if using local PostgreSQL):
```bash
# Using psql
psql -U postgres
CREATE DATABASE vigility_dashboard;
\q
```

Run Prisma migrations:
```bash
npm run db:migrate
npm run db:generate
```

Seed the database:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
```

Create your `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Seed Instructions

The seed script creates **10 users** and **150 feature click events** spread across the last 60 days, covering all feature types and user demographics.

```bash
cd backend
npm run seed
```

All seeded users share the same password:
```
password: password123
```

The seed usernames are printed in the terminal after running the script. Use any of them to log in.

To re-seed (clears existing data first):
```bash
npm run seed
```

The seed script automatically deletes all existing data before inserting fresh records, so it's safe to run multiple times.

---

## API Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| GET | `/health` | ❌ | Health check |
| POST | `/register` | ❌ | Register a new user |
| POST | `/login` | ❌ | Login and receive JWT token |
| POST | `/track` | ✅ Bearer Token | Log a feature interaction |
| GET | `/analytics` | ✅ Bearer Token | Get aggregated chart data |

### POST /register — Request Body
```json
{
  "username": "john_doe",
  "password": "secret123",
  "age": 25,
  "gender": "Male"
}
```

### POST /login — Request Body
```json
{
  "username": "john_doe",
  "password": "secret123"
}
```

### POST /track — Request Body
```json
{
  "feature_name": "date_filter"
}
```

### GET /analytics — Query Parameters
| Param | Values | Description |
|-------|--------|-------------|
| `startDate` | ISO date string e.g. `2024-01-01` | Filter by start date |
| `endDate` | ISO date string e.g. `2024-03-31` | Filter by end date |
| `age` | `<18`, `18-40`, `>40` | Filter by user age group |
| `gender` | `Male`, `Female`, `Other` | Filter by user gender |
| `feature` | e.g. `date_filter` | Get line chart data for this feature |

### Standard Response Format
```json
{
  "success": true,
  "message": "Analytics data fetched successfully",
  "data": {
    "barChart": [...],
    "lineChart": [...]
  }
}
```

---

## Architectural Choices

### Backend — Layered Architecture
The backend follows a strict separation of concerns with 5 distinct layers:

- **Routes** — Only map HTTP methods and paths to controllers. Zero logic.
- **Controllers** — Handle `req`/`res`, call one service method, return response. No business logic.
- **Services** — All business logic and Prisma database queries live here.
- **Validations** — Joi schemas validate all incoming request data before it reaches the controller.
- **Middlewares** — JWT auth, global error handler, and Joi validation runner are all centralised and reusable.

This pattern ensures that adding a new endpoint never requires touching existing logic, and every layer is independently testable.

### Frontend — State Management
- **Zustand** is used for global state (auth token, user, filters) instead of Context API because it avoids unnecessary re-renders and has a simpler API.
- **Auth state** is persisted in `localStorage` via Zustand's `persist` middleware so users stay logged in on refresh.
- **Filter state** is persisted in **cookies** (as required by the spec) via `js-cookie` so filter preferences survive page refreshes.

### The Self-Referential Twist
Every user interaction (filter change, chart click) fires a `POST /track` request to log itself as a `FeatureClick` event. Those events then appear in the analytics charts on the next data fetch. This creates a feedback loop where the dashboard literally visualises its own usage.

### Database Indexing
The `FeatureClick` table has indexes on `featureName`, `timestamp`, and `userId` — the three most commonly filtered columns in the analytics query. This ensures the `GROUP BY` aggregation query stays fast even as the table grows.

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Netlify | https://product-tracking-dashboard.netlify.app |
| Backend | Render | https://product-tracker-dashboard.onrender.com |
| Database | Neon (PostgreSQL) | Managed cloud PostgreSQL |

---

## Scaling to 1 Million Write-Events Per Minute

At 1 million writes per minute (~16,700 writes/second), the current architecture of writing directly to PostgreSQL on every `/track` request would collapse under I/O pressure. Here is how I would redesign the backend to handle this scale:

**1. Decouple writes with a Message Queue:** Instead of inserting directly into PostgreSQL, the `/track` endpoint would publish each event to a **Kafka topic** (or Redis Streams for a lighter setup). Publishing to Kafka is near-instant and the endpoint returns immediately — the database is no longer in the critical path of the HTTP request.

**2. Batch Consumer Workers:** A pool of background worker processes would consume events from Kafka and perform bulk inserts into PostgreSQL using `INSERT INTO ... VALUES (...), (...), (...)` — batching 500–1000 rows per query. Bulk inserts are orders of magnitude faster than individual inserts and dramatically reduce database I/O.

**3. Read/Write Separation:** The analytics read path (`GET /analytics`) and the write path (`POST /track`) would be split across separate PostgreSQL instances — primary for writes, read replicas for queries. This eliminates contention between the two workloads.

**4. Time-Series Optimised Database:** The `FeatureClick` table would be migrated to **TimescaleDB** (a PostgreSQL extension) or **ClickHouse**, both of which are purpose-built for append-heavy, time-series workloads and can aggregate billions of rows in milliseconds.

**5. Horizontal Scaling:** Since the Express API is stateless (JWT-based auth with no server-side sessions), multiple instances can run behind a load balancer (Nginx or AWS ALB) with zero coordination overhead. Auto-scaling groups can spin up new instances during traffic spikes and terminate them during off-peak hours.
