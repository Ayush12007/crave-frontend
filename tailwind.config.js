/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        primary: '#FF5F1F', // Bright Neon Orange
        primaryDark: '#E04F15',
        secondary: '#1A1A1A', // Rich Black
        cream: '#FDFBF7', // Warm Background
        gold: '#F59E0B', // Star ratings
        surface: '#FFFFFF',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(255, 95, 31, 0.5)',
      },
      backgroundImage: {
        'pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
      }
    },
  },
  plugins: [],
}