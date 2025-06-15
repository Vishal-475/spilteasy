/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,jsx,ts,tsx}",        // <-- For App.jsx in root
    "./components/**/*.{js,jsx}", // <-- For components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
