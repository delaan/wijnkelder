/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-soft': 'var(--accent-soft)',
        'accent-contrast': 'var(--accent-contrast)',
        'accent-soft-text': 'var(--accent-soft-text)',
        'nav-active': 'var(--nav-active-bg)',
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        overlay: 'var(--overlay)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'success-bg': 'var(--success-bg)',
        success: 'var(--success-text)',
        'danger-bg': 'var(--danger-bg)',
        'danger-text': 'var(--danger-text)',
        danger: 'var(--danger)',
        'danger-hover': 'var(--danger-hover)',
        'warning-bg': 'var(--warning-bg)',
        warning: 'var(--warning-text)',
        type: {
          rood: 'var(--type-rood)',
          wit: 'var(--type-wit)',
          rose: 'var(--type-rose)',
          mousserend: 'var(--type-mousserend)',
          dessert: 'var(--type-dessert)',
        },
        // Compatibiliteitsalias voor oudere schermen (bv. het beheerpaneel)
        // die nog met de vroegere "wine-*" kleurnamen werken.
        wine: {
          50: 'var(--surface)',
          100: 'var(--accent-soft)',
          200: 'var(--accent-soft)',
          700: 'var(--accent)',
          800: 'var(--accent)',
          900: 'var(--accent-hover)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        'token-sm': 'var(--radius-sm)',
        'token-md': 'var(--radius-md)',
        'token-lg': 'var(--radius-lg)',
        'token-full': 'var(--radius-full)',
      },
      boxShadow: {
        'token-sm': 'var(--shadow-sm)',
        'token-md': 'var(--shadow-md)',
        'token-lg': 'var(--shadow-lg)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '320ms',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.32s cubic-bezier(0.16,1,0.3,1)',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      zIndex: {
        nav: 'var(--z-nav)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
    },
  },
  plugins: [],
}
