import Button from './Button';
import CoinIcon from './CoinIcon';

export default function LessonCard({ lesson, completed, score, onSelect }) {
  return (
    <article
      onClick={() => onSelect(lesson.id)}
      className={[
        'rounded-card border-b-4 overflow-hidden',
        'shadow-card hover:shadow-card-hover',
        'hover:-translate-y-1.5 active:translate-y-0 active:border-b-0',
        'transition-all duration-200 cursor-pointer',
        'focus-within:ring-2 focus-within:ring-brand-accent focus-within:ring-offset-2',
        completed
          ? 'bg-brand-success-light border-brand-success'
          : 'bg-brand-surface border-brand-primary-muted',
      ].join(' ')}
    >
      {/* Completion banner — only shown when done */}
      {completed && (
        <div className="flex items-center justify-between bg-brand-success px-4 py-2">
          <span className="text-white font-black text-sm tracking-wide uppercase flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            Completed
          </span>
          {score != null && (
            <span className="text-white font-black text-sm bg-white/20 rounded-pill px-2.5 py-0.5">
              {score}%
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Reward badge row */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-3xl" aria-hidden="true">{completed ? '📘' : '📖'}</span>
          <span
            className={[
              'inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-pill shadow-sm',
              completed
                ? 'bg-brand-success/20 text-brand-success-dark'
                : 'bg-brand-gold text-white',
            ].join(' ')}
          >
            {completed ? (
              'Earned'
            ) : (
              <>+{lesson.coinReward}<CoinIcon className="w-4 h-4" /></>
            )}
          </span>
        </div>

        {/* Title */}
        <h3
          className={[
            'font-black text-lg leading-tight',
            completed ? 'text-brand-success-dark' : 'text-brand-primary',
          ].join(' ')}
        >
          {lesson.title}
        </h3>

        <p className="text-sm text-brand-muted mt-2 line-clamp-2 font-medium">
          {lesson.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400 font-semibold">
            {lesson.questions.length} question{lesson.questions.length !== 1 ? 's' : ''}
          </span>
          <Button
            variant={completed ? 'success' : 'primary'}
            size="sm"
            onClick={(e) => { e.stopPropagation(); onSelect(lesson.id); }}
            aria-label={`${completed ? 'Review' : 'Start'} lesson: ${lesson.title}`}
          >
            {completed ? 'Review' : 'Start →'}
          </Button>
        </div>
      </div>
    </article>
  );
}
