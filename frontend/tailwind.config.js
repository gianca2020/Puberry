/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Indigo bridges "trustworthy/educational" blue with Puberry's playful purple identity.
        // The nested scale gives us surface tints, hover states, and 3D-border shadows from one token.
        'brand-primary': {
          DEFAULT: '#4338CA', // indigo-700
          light:   '#E0E7FF', // indigo-100 — card tints, selected states
          muted:   '#818CF8', // indigo-400 — secondary labels
          dark:    '#3730A3', // indigo-800 — border-b press shadow
        },
        // Violet is a deliberate hue shift from brand-primary — just far enough to signal
        // "action/CTA" without clashing. Used exclusively on submit buttons and key prompts.
        'brand-accent': {
          DEFAULT: '#7C3AED', // violet-600
          light:   '#EDE9FE', // violet-100
          dark:    '#5B21B6', // violet-800 — 3D border press
        },
        // Amber = coins, treasure, reward. Universally understood in gamification UIs.
        'brand-gold': {
          DEFAULT: '#FBBF24', // amber-400
          dark:    '#D97706', // amber-600 — 3D border press
        },
        // Emerald = correct answers, health, growth — on-brand for a health EdTech platform.
        'brand-success': {
          DEFAULT: '#10B981', // emerald-500
          light:   '#D1FAE5', // emerald-100 — completed-lesson card bg
          dark:    '#059669', // emerald-600
        },
        'brand-danger': {
          DEFAULT: '#EF4444', // red-500
          light:   '#FEE2E2', // red-100
          dark:    '#DC2626', // red-600
        },
        // Semantic surface tokens so components never hard-code #fff or bg-sky-100.
        'brand-surface': '#FFFFFF',
        'brand-bg':      '#E0F2FE', // sky-100 — page canvas
        'brand-muted':   '#6B7280', // gray-500 — body copy / metadata
      },
      fontFamily: {
        // Rubik: geometric-rounded, highly legible at small sizes, widely used in K-12 apps.
        // The rounded letterforms mirror Puberry's soft-corner card aesthetic.
        sans: ['Rubik', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '1.5rem',  // 24px — matches Puberry's signature rounded-3xl cards
        'btn':  '0.75rem', // 12px — button corners
        'pill': '9999px',  // badges / coin display
      },
      boxShadow: {
        // Indigo-tinted shadow ties card depth to the brand color, avoiding generic gray shadows.
        'card':       '0 8px 24px -4px rgba(67, 56, 202, 0.12)',
        'card-hover': '0 16px 32px -4px rgba(67, 56, 202, 0.20)',
        // Gold-glow shadow makes the coin badge feel premium, not just yellow.
        'badge':      '0 4px 12px rgba(251, 191, 36, 0.40)',
      },
    },
  },
  plugins: [],
}
