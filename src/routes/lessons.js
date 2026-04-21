const express = require('express');
const { getAllLessons, getLessonById, getOrCreateStudent } = require('../data/store');

const router = express.Router();

const PASS_THRESHOLD = 0.7;

function sanitizeLesson(lesson) {
  return {
    ...lesson,
    questions: lesson.questions.map(({ correctIndex: _omit, ...q }) => q),
  };
}

// GET /lessons
router.get('/', (req, res) => {
  const lessons = getAllLessons().map(sanitizeLesson);
  res.json(lessons);
});

// GET /lessons/:id
router.get('/:id', (req, res) => {
  const lesson = getLessonById(req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: { code: 'LESSON_NOT_FOUND', message: `No lesson with id '${req.params.id}'` } });
  }
  res.json(sanitizeLesson(lesson));
});

// POST /lessons/:id/quiz
router.post('/:id/quiz', (req, res) => {
  const lesson = getLessonById(req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: { code: 'LESSON_NOT_FOUND', message: `No lesson with id '${req.params.id}'` } });
  }

  const { studentId, answers, studentName } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: { code: 'MISSING_STUDENT_ID', message: "'studentId' is required" } });
  }

  if (
    !Array.isArray(answers) ||
    answers.length !== lesson.questions.length ||
    answers.some((a, i) => !Number.isInteger(a) || a < 0 || a >= lesson.questions[i].options.length)
  ) {
    return res.status(400).json({
      error: {
        code: 'INVALID_ANSWERS',
        message: `'answers' must be an array of ${lesson.questions.length} zero-based option indices`,
      },
    });
  }

  const student = getOrCreateStudent(studentId, studentName);

  if (student.progress[lesson.id]?.completed) {
    return res.status(409).json({ error: { code: 'ALREADY_COMPLETED', message: 'Lesson already completed — coins already awarded' } });
  }

  const correct = answers.filter((ans, i) => ans === lesson.questions[i].correctIndex).length;
  const score = correct / lesson.questions.length;
  const passed = score >= PASS_THRESHOLD;
  const coinsEarned = passed ? lesson.coinReward : 0;

  student.progress[lesson.id] = {
    completed: passed,
    score,
    attempts: (student.progress[lesson.id]?.attempts || 0) + 1,
    completedAt: passed ? new Date().toISOString() : null,
  };

  if (passed) {
    student.coinBalance += coinsEarned;
  }

  res.json({
    passed,
    score: Math.round(score * 100),
    coinsEarned,
    newBalance: student.coinBalance,
    message: passed ? 'Congratulations! You passed and earned coins.' : `Score too low. You need ${PASS_THRESHOLD * 100}% to pass.`,
  });
});

module.exports = router;
