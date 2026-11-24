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
        mono: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
          black: '#000000',
          white: '#FFFFFF',
        },
        pastel: {
          bg: '#FAFAFA',
          card: '#FFFFFF',
          cardMuted: '#F4F4F5',
          pink: '#E4E4E7',
          pinkLight: '#F4F4F5',
          pinkSoft: '#FAFAFA',
          lavender: '#D4D4D8',
          lavenderLight: '#E4E4E7',
          lavenderSoft: '#F4F4F5',
          lavenderDark: '#18181B',
          purple: '#18181B',
          purpleDark: '#09090B',
          textMain: '#09090B',
          textMuted: '#71717A',
          border: '#E4E4E7',
          borderSubtle: '#F4F4F5',
        },
        darkLav: {
          bg: '#000000',
          surface: '#0A0A0A',
          card: '#121212',
          cardHover: '#1A1A1A',
          border: '#27272A',
          accent: '#FFFFFF',
          textMain: '#FAFAFA',
          textMuted: '#A1A1AA',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        clock: ['Outfit', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 24px -6px rgba(0, 0, 0, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 16px 32px -8px rgba(0, 0, 0, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'soft-xl': '0 24px 48px -12px rgba(0, 0, 0, 0.18)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'flip-card': '0 12px 32px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.2)',
        'flip-card-dark': '0 16px 40px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
