const lessons = [
  {
    id: 'lesson_01',
    title: 'Introduction to Algebra',
    content: 'Algebra is the branch of mathematics dealing with symbols and the rules for manipulating those symbols.',
    coinReward: 10,
    questions: [
      { id: 'q1', prompt: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctIndex: 1 },
      { id: 'q2', prompt: 'What is 5 * 3?', options: ['10', '12', '15', '18'], correctIndex: 2 },
      { id: 'q3', prompt: 'What is 10 / 2?', options: ['3', '4', '5', '6'], correctIndex: 2 },
    ],
  },
  {
    id: 'lesson_02',
    title: 'Basic Geometry',
    content: 'Geometry is the branch of mathematics concerned with the properties and relations of points, lines, surfaces, and solids.',
    coinReward: 10,
    questions: [
      { id: 'q1', prompt: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], correctIndex: 1 },
      { id: 'q2', prompt: 'What is the area formula for a rectangle?', options: ['l + w', 'l * w', '2(l + w)', 'l^2'], correctIndex: 1 },
      { id: 'q3', prompt: 'How many degrees are in a right angle?', options: ['45', '60', '90', '180'], correctIndex: 2 },
    ],
  },
  {
    id: 'lesson_03',
    title: 'Introduction to Biology',
    content: 'Biology is the natural science that studies life and living organisms, including their physical structure, chemical processes, and evolution.',
    coinReward: 10,
    questions: [
      { id: 'q1', prompt: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], correctIndex: 2 },
      { id: 'q2', prompt: 'What molecule carries genetic information?', options: ['RNA', 'DNA', 'ATP', 'mRNA'], correctIndex: 1 },
      { id: 'q3', prompt: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], correctIndex: 2 },
    ],
  },
];

// keyed by studentId
const students = {};

function getLessonById(id) {
  return lessons.find((l) => l.id === id) || null;
}

function getAllLessons() {
  return lessons;
}

function getOrCreateStudent(id, name = 'Anonymous') {
  if (!students[id]) {
    students[id] = {
      id,
      name,
      coinBalance: 0,
      progress: {},
    };
  }
  return students[id];
}

module.exports = { getLessonById, getAllLessons, getOrCreateStudent };
