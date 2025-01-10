/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // Si tu utilises la nouvelle app router de Next.js
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
}
