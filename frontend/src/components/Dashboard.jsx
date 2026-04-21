import CoinBadge from './CoinBadge';

export default function Dashboard({ profile, lessons, onSelectLesson }) {
  const completedIds = new Set(
    (profile?.completedLessons || []).map((l) => l.lessonId)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black text-indigo-700 drop-shadow-sm">
            Welcome back, {profile?.name ?? '…'}! 👋
          </h1>
          <p className="text-indigo-400 mt-1 font-semibold text-lg">Pick a lesson and earn coins!</p>
        </div>
        <CoinBadge balance={profile?.coinBalance ?? 0} />
      </div>

      {/* Completed summary */}
      {profile?.completedLessons?.length > 0 && (
        <div className="mb-8 bg-emerald-100 border-b-4 border-emerald-400 rounded-3xl p-5 shadow-lg">
          <h2 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-3">
            ✅ Completed!
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.completedLessons.map((l) => (
              <span
                key={l.lessonId}
                className="bg-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm"
              >
                {l.title} — {l.score}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lesson cards */}
      <h2 className="text-2xl font-black text-indigo-600 mb-5">All Lessons</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const done = completedIds.has(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`text-left rounded-3xl border-b-4 p-5 shadow-xl hover:-translate-y-2 active:translate-y-0 active:border-b-0 transition-transform duration-200 cursor-pointer ${
                done
                  ? 'bg-emerald-100 border-emerald-400'
                  : 'bg-white border-indigo-300 hover:border-indigo-400'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-4xl">{done ? '✅' : '📖'}</span>
                <span
                  className={`text-xs font-black px-3 py-1.5 rounded-full shadow-sm ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-400 text-white'
                  }`}
                >
                  {done ? 'Done!' : `+${lesson.coinReward} 🪙`}
                </span>
              </div>
              <h3 className={`font-black text-lg leading-tight ${done ? 'text-emerald-800' : 'text-indigo-700'}`}>
                {lesson.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2 font-medium">
                {lesson.content}
              </p>
              <p className="text-xs text-gray-400 mt-3 font-semibold">
                {lesson.questions.length} questions
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
