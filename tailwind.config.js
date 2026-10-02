/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-cream': '#FDFBF7',
        'soft-pink': '#FFD6E0',
        'peach': '#FFB5A7',
        'gold': '#F8C660',
        'deep-burgundy': '#5A2A3B',
      }
    },
  },
  plugins: [],
}
