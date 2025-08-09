// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A13500',
        accent: '#FF8345',
        'coke-red': '#E41B17',
        gold: '#D4AF37'
      },
      dropShadow: {
        // utilidade custom — use hover:drop-shadow-accent nos componentes
        accent: '0 0 6px #FF8345'
      }
    }
  },
  plugins: []
};
