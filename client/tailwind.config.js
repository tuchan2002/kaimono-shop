/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "m-plus1": ['"M PLUS 1"', "sans-serif"],
      },
      colors: {
        primary: "#ee2624",
        "primary-blur": "#f1514f",
        secondary: "#f2f3f4",
      },
    },
  },
  plugins: [],
};
