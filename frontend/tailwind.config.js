/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Source Sans 3'", "sans-serif"],
      },
      colors: {
        clay: {
          50: "#f7f3ee",
          200: "#e6d9c9",
          500: "#b9835a",
          800: "#3f2a1f",
          900: "#231810",
        },
        leaf: {
          200: "#cde8c1",
          500: "#5c8f3c",
          700: "#3e6a2b",
        },
        accent: {
          400: "#f0a23b",
          600: "#d88417",
        },
        ink: {
          700: "#22301f",
        },
      },
    },
  },
  plugins: [],
};
