/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f2ff",
          100: "#ebe6ff",
          200: "#d6ccff",
          300: "#b3a1ff",
          400: "#8d70ff",
          500: "#6d3bff",
          600: "#5a22f0",
          700: "#4a18c9",
          800: "#3d17a1",
          900: "#331680",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
