const express = require('express');
const lessonsRouter = require('./routes/lessons');
const studentsRouter = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/lessons', lessonsRouter);
app.use('/students', studentsRouter);

app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route '${req.path}' does not exist` } });
});

app.listen(PORT, () => {
  console.log(`Puberry backend running on http://localhost:${PORT}`);
});
