/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        'brand-primary': '#58cc02', // Duolingo Green
        'brand-secondary': '#46178f', // Kahoot Purple
        'brand-accent': '#ff4b4b', // Red
        'brand-yellow': '#ffc800', // Yellow
      }
    },
  },
  plugins: [],
}