/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fbf3f3',
          100: '#f5e1e2',
          200: '#e9c3c6',
          300: '#d69ba0',
          400: '#bd6b73',
          500: '#a04a54',
          600: '#7d1f2a',
          700: '#6b1a24',
          800: '#591620',
          900: '#3d0f16',
          950: '#26090d',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
