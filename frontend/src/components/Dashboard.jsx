import CoinBadge from './CoinBadge';
import LessonCard from './LessonCard';

export default function Dashboard({ profile, lessons, onSelectLesson }) {
  // profile.lessons comes from GET /students/:id/profile
  const lessonProgressMap = Object.fromEntries(
    (profile?.lessons || []).map((l) => [l.lessonId, l])
  );

  const completedLessons = (profile?.lessons || []).filter((l) => l.completed);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-primary drop-shadow-sm">
            {profile?.name ? `Welcome back, ${profile.name}!` : 'Your Dashboard'}
          </h1>
          <p className="text-brand-primary-muted mt-1 font-semibold text-lg">
            Pick a lesson and earn coins!
          </p>
        </div>
        <CoinBadge balance={profile?.coinBalance ?? 0} />
      </div>

      {/* Completed summary */}
      {completedLessons.length > 0 && (
        <div className="mb-8 bg-brand-success-light border-b-4 border-brand-success rounded-card p-5 shadow-card">
          <h2 className="text-sm font-black text-brand-success-dark uppercase tracking-widest mb-3">
            Completed lessons
          </h2>
          <div className="flex flex-wrap gap-2">
            {completedLessons.map((l) => (
              <span
                key={l.lessonId}
                className="bg-brand-success text-white text-sm font-bold px-4 py-1.5 rounded-pill shadow-sm"
              >
                {l.title} — {l.score}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lesson grid */}
      <h2 className="text-2xl font-black text-brand-primary mb-5">All Lessons</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const progress = lessonProgressMap[lesson.id];
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={progress?.completed ?? false}
              score={progress?.score ?? null}
              onSelect={onSelectLesson}
            />
          );
        })}
      </div>
    </div>
  );
}
