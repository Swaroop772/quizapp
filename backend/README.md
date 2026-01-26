# Ad Tech Quiz - Backend

Backend API for the Ad Tech Quiz with PostgreSQL database and global leaderboard.

## Prerequisites

- Node.js 18+
- PostgreSQL installed and running

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Update `.env` file with your PostgreSQL credentials:

```
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/adtech_quiz?schema=public"
PORT=3001
```

### 3. Create Database

Option A: Using PostgreSQL command line
```bash
psql -U postgres
CREATE DATABASE adtech_quiz;
\q
```

Option B: Using pgAdmin or any PostgreSQL GUI

### 4. Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### POST /api/scores
Submit a new quiz score

**Request Body:**
```json
{
  "name": "John Doe",
  "score": 8,
  "totalQuestions": 10,
  "timeUsed": 420
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "score": 8,
  "totalQuestions": 10,
  "timeUsed": 420,
  "percentage": 80,
  "createdAt": "2026-01-26T10:00:00.000Z"
}
```

### GET /api/scores
Get leaderboard (top 10 by default)

**Query Parameters:**
- `limit` (optional): Number of scores to return

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "score": 10,
    "totalQuestions": 10,
    "timeUsed": 300,
    "percentage": 100,
    "createdAt": "2026-01-26T10:00:00.000Z"
  },
  ...
]
```

### GET /api/scores/stats
Get overall statistics

**Response:**
```json
{
  "totalAttempts": 150,
  "averagePercentage": 75,
  "averageTime": 450,
  "highestScore": {
    "id": 1,
    "name": "John Doe",
    "percentage": 100,
    ...
  }
}
```

## Database Management

View database in browser:
```bash
npm run prisma:studio
```

## Port

The backend runs on port **3001** by default.
