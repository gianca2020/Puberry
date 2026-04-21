const BASE = '';
const STUDENT_ID = 'student_01';
const STUDENT_NAME = 'Jane Doe';

export async function fetchProfile() {
  const res = await fetch(`${BASE}/students/${STUDENT_ID}/profile?name=${encodeURIComponent(STUDENT_NAME)}`);
  if (!res.ok) throw new Error('Failed to load profile');
  return res.json();
}

export async function fetchLessons() {
  const res = await fetch(`${BASE}/lessons`);
  if (!res.ok) throw new Error('Failed to load lessons');
  return res.json();
}

export async function fetchLesson(id) {
  const res = await fetch(`${BASE}/lessons/${id}`);
  if (!res.ok) throw new Error('Failed to load lesson');
  return res.json();
}

export async function submitQuiz(lessonId, answers) {
  const res = await fetch(`${BASE}/lessons/${lessonId}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: STUDENT_ID, studentName: STUDENT_NAME, answers }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message ?? 'Request failed');
    err.status = res.status;
    err.error = data?.error;
    throw err;
  }
  return data;
}
