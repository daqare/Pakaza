/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./app/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pakaza: {
          blue: "#0056B3",
          darkBlue: "#003D82",
          green: "#28A745",
          red: "#DC3545",
          light: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};
