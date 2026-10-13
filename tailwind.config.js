/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nfsu: {
          navy: {
            DEFAULT: '#0b1f3a',
            light: '#16325c',
            dark: '#071324',
          },
          gold: {
            DEFAULT: '#d97706',
            light: '#f59e0b',
            dark: '#b45309',
          },
          crimson: '#991b1b',
          surface: {
            light: '#f8fafc',
            card: '#ffffff',
            dark: '#0f172a',
            darkCard: '#1e293b'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(11, 31, 58, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glow-gold': '0 0 20px -3px rgba(217, 119, 6, 0.35)',
        'glow-navy': '0 0 25px -5px rgba(22, 50, 92, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
