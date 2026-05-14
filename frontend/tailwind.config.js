/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#fef1f5",
          100: "#fde4ec",
          200: "#fbcdd9",
          300: "#f7a4bc",
          400: "#f1708f",
          500: "#e84572",
          600: "#D4174F",
          700: "#b31240",
          800: "#941238",
          900: "#7c1232",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
