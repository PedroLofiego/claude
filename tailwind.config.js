/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          950: "#0b1020",
          900: "#0f1530",
          800: "#172046",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(2, 6, 23, 0.25)",
      },
    },
  },
  plugins: [],
};
