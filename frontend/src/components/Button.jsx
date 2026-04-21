import { forwardRef } from 'react';

/**
 * Variant → [bg, border-b color, hover bg]
 *
 * The border-b-4 / active:border-b-0 + active:translate-y-1 combo is a deliberate
 * "Duolingo-style" 3D press effect. It gives K-12 users tactile affordance that a
 * standard box-shadow hover cannot provide on touch screens.
 */
const VARIANTS = {
  primary: 'bg-brand-primary border-brand-primary-dark text-white hover:bg-brand-primary-dark',
  accent:  'bg-brand-accent  border-brand-accent-dark  text-white hover:bg-brand-accent-dark',
  success: 'bg-brand-success border-brand-success-dark text-white hover:bg-brand-success-dark',
  danger:  'bg-brand-danger  border-brand-danger-dark  text-white hover:bg-brand-danger-dark',
  ghost:   'bg-brand-surface border-brand-primary-muted text-brand-primary hover:bg-brand-primary-light',
};

const SIZES = {
  sm:   'px-4  py-2   text-sm  rounded-btn',
  md:   'px-6  py-3   text-base rounded-btn',
  lg:   'px-8  py-4   text-lg  rounded-2xl',
  full: 'w-full px-6  py-4   text-lg  rounded-2xl',
};

const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-black tracking-wide',
        'border-b-4',
        'transition-transform duration-100',
        'hover:-translate-y-0.5',
        'active:translate-y-0.5 active:border-b-0',
        // Keyboard focus ring uses brand-accent so it's visible against any background.
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2',
        'disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400',
        'disabled:translate-y-0 disabled:cursor-not-allowed',
        'shadow-md',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin" aria-hidden="true">⏳</span>
          <span>Loading…</span>
        </>
      ) : children}
    </button>
  );
});

export default Button;
