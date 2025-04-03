/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': '#000000',
        'white': '#FFFFFF',
        'electric-blue': '#00F0FF',
        'neon-pink': '#FF00F5',
      },
      fontFamily: {
        'domine': ['Domine', 'serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      animation: {
        'neon-pulse': 'neonPulse 2s infinite',
      },
      keyframes: {
        neonPulse: {
          '0%, 100%': { 
            textShadow: '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #00F0FF, 0 0 82px #00F0FF, 0 0 92px #00F0FF, 0 0 102px #00F0FF, 0 0 151px #00F0FF'
          },
          '50%': { 
            textShadow: '0 0 4px #fff, 0 0 7px #fff, 0 0 13px #fff, 0 0 25px #00F0FF, 0 0 45px #00F0FF, 0 0 55px #00F0FF, 0 0 70px #00F0FF, 0 0 100px #00F0FF'
          }
        }
      }
    },
  },
  plugins: [],
}
