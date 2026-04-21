const express = require('express');
const { getOrCreateStudent, getAllLessons } = require('../data/store');

const router = express.Router();

// GET /students/:id/profile
router.get('/:id/profile', (req, res) => {
  const student = getOrCreateStudent(req.params.id);

  const allLessons = getAllLessons();
  const lessons = allLessons.map((l) => {
    const progress = student.progress[l.id];
    return {
      lessonId: l.id,
      title: l.title,
      completed: progress?.completed ?? false,
      score: progress?.completed ? Math.round(progress.score * 100) : null,
      completedAt: progress?.completedAt ?? null,
    };
  });

  res.json({
    id: student.id,
    name: student.name,
    coinBalance: student.coinBalance,
    lessons,
  });
});

module.exports = router;
