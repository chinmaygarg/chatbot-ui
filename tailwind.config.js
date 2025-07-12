/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chatbot': {
          'primary': 'var(--chatbot-primary)',
          'secondary': 'var(--chatbot-secondary)',
          'background': 'var(--chatbot-background)',
          'surface': 'var(--chatbot-surface)',
          'text': 'var(--chatbot-text)',
          'text-secondary': 'var(--chatbot-text-secondary)',
          'border': 'var(--chatbot-border)',
          'hover': 'var(--chatbot-hover)',
          'accent': 'var(--chatbot-accent)',
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 0.8 },          '50%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'wave': {
          '0%, 100%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}