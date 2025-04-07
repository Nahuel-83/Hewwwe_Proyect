/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'domine': ['Domine', 'serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      colors: {
        'electric-blue': '#00F0FF',
        'neon-pink': '#FF00F5',
      },
    },
  },
  plugins: [],
}
