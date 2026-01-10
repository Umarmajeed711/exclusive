/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          // changes

          primary: "#03A9F4",
          secondary: "#4EC3F8",
          background: "#F1F5F9", //  Background
          white: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
