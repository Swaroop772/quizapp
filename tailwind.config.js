/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed', // Orange-50
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Orange-500 (Primary - Naruto)
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        accent: {
          400: '#38bdf8', // Sky-400 (Rasengan Blue)
          500: '#0ea5e9',
          600: '#0284c7',
        },
        dark: {
          bg: '#0a0a0f', // Very dark ninja night
          surface: '#11111b',
          card: '#181825',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bangers', 'cursive'], // Anime title font
        ninja: ['Shojumaru', 'system-ui'], // Ninja Brush font
        body: ['Saira', 'sans-serif'], // Energetic body font
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
        'shuriken-spin': 'shuriken-spin 1s linear infinite',
        'speed-lines': 'speed-lines 0.5s linear infinite',
        'ninja-run': 'ninja-run 0.5s steps(4) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shuriken-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'speed-lines': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100px 0' }
        }
      }
    },
  },
  plugins: [],
}
