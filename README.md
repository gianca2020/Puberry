# Puberry 

## 1. Setup & Run

### Backend
```bash
npm install
npm start
# → http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Both must be running at the same time. The frontend proxies `/lessons` and `/students` to `localhost:3000` via Vite's dev proxy, so no CORS configuration is needed.

---

## 2. System Design Choices

**In-memory store**
All data lives in `src/data/store.js` as plain JavaScript objects. No database is needed for this scope — the store is seeded on startup and resets when the server restarts. This keeps the setup to a single `npm start` with zero external dependencies.

**Single-student assumption**
The spec describes one student interacting with the system. The mock student ID (`student_01`) is used throughout. `getOrCreateStudent` auto-provisions the student on first profile fetch, so no separate registration step is required.

**Answer sanitization**
The `GET /lessons/:id` endpoint strips `correctIndex` from every question before sending the response. Answer keys never leave the server, so a client cannot read the correct answers from the network tab.

**Idempotency guard**
`POST /lessons/:id/quiz` checks `student.progress[lessonId]?.completed` before grading. If the lesson is already completed it returns `409 ALREADY_COMPLETED` immediately, preventing a student from earning coins more than once per lesson.

**Quiz retry on failure**
A failed attempt (score below 70%) records `completed: false` and increments an `attempts` counter, but does not lock the student out. They may retry until they pass. Coins are awarded exactly once — on the first passing submission — because the idempotency guard fires on `completed === true`.

---

## 3. API Reference

### List all lessons
```bash
curl http://localhost:3000/lessons
```

### Get a single lesson
```bash
curl http://localhost:3000/lessons/lesson_01
```

### Submit a quiz
Answers are a zero-based index array matching each question in order.
```bash
curl -X POST http://localhost:3000/lessons/lesson_01/quiz \
  -H "Content-Type: application/json" \
  -d '{"studentId": "student_01", "studentName": "Jane Doe", "answers": [1, 2, 2]}'
```

Response:
```json
{
  "passed": true,
  "score": 100,
  "coinsEarned": 10,
  "newBalance": 10,
  "message": "Congratulations! You passed and earned coins."
}
```

### Get student profile
```bash
curl http://localhost:3000/students/student_01/profile
```

Response includes all lessons with a per-lesson `completed` flag:
```json
{
  "id": "student_01",
  "name": "Jane Doe",
  "coinBalance": 10,
  "lessons": [
    { "lessonId": "lesson_01", "title": "Introduction to Algebra", "completed": true, "score": 100, "completedAt": "2026-04-20T18:00:00.000Z" },
    { "lessonId": "lesson_02", "title": "Basic Geometry", "completed": false, "score": null, "completedAt": null },
    { "lessonId": "lesson_03", "title": "Introduction to Biology", "completed": false, "score": null, "completedAt": null }
  ]
}
```

---

## 4. Note on Coin Rewards

The spec requires a flat **10 coins** per completed lesson, which this implementation follows. The data model includes a `coinReward` field on each lesson as a deliberate design extension — it allows per-lesson reward values to be configured independently without any code changes, supporting potential future requirements like bonus lessons or difficulty tiers.
