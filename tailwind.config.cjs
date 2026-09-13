/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "hsl(210, 60%, 70%)",
          DEFAULT: "hsl(210, 60%, 55%)",
          dark: "hsl(210, 60%, 40%)"
        },
        accent: {
          light: "hsl(140, 70%, 70%)",
          DEFAULT: "hsl(140, 70%, 45%)",
          dark: "hsl(140, 70%, 30%)"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
