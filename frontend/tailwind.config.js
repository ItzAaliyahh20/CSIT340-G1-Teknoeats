/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <- scan all React files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B3A3A",
        secondary: "#FFD700",
        accent: "#FFD700",
        background: "#ffffff",
        foreground: "#000000",
        card: "#ffffff",
        cardForeground: "#000000",
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
