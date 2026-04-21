import Button from './Button';

/**
 * LessonCard
 *
 * Uses <article> (not <div>) so screen readers announce it as a self-contained
 * content region. The card itself is clickable for large touch targets, while
 * the inner Button provides a keyboard-accessible entry point with a descriptive
 * aria-label — satisfying both pointer and keyboard/AT users.
 *
 * Mobile-first sizing: single column by default, grid handled by the parent.
 * The hover lift + brand-tinted shadow creates depth without overwhelming a
 * child-focused color palette.
 */
export default function LessonCard({ lesson, completed, onSelect }) {
  return (
    <article
      onClick={() => onSelect(lesson.id)}
      className={[
        'rounded-card border-b-4 p-5',
        'shadow-card hover:shadow-card-hover',
        'hover:-translate-y-1.5 active:translate-y-0 active:border-b-0',
        'transition-all duration-200 cursor-pointer',
        // Focus ring applied to the article so the whole card is keyboard-navigable
        // without requiring a wrapping <button> that would nest interactive elements.
        'focus-within:ring-2 focus-within:ring-brand-accent focus-within:ring-offset-2',
        completed
          ? 'bg-brand-success-light border-brand-success'
          : 'bg-brand-surface     border-brand-primary-muted',
      ].join(' ')}
    >
      {/* Header row: icon + reward badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-3xl" aria-hidden="true">
          {completed ? '✅' : '📖'}
        </span>
        <span
          className={[
            'text-xs font-black px-3 py-1.5 rounded-pill shadow-sm',
            completed
              ? 'bg-brand-success text-white'
              : 'bg-brand-gold    text-white',
          ].join(' ')}
        >
          {completed ? 'Done!' : `+${lesson.coinReward} 🪙`}
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

      {/* Preview — line-clamp prevents layout thrash across varied content lengths */}
      <p className="text-sm text-brand-muted mt-2 line-clamp-2 font-medium">
        {lesson.content}
      </p>

      {/* Footer: metadata + CTA */}
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
    </article>
  );
}
