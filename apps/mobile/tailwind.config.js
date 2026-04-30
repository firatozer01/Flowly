/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#080c14",
        "bg-secondary": "#0d1220",
        "accent-blue": "#4f8ef7",
        "accent-purple": "#a78bfa",
      },
    },
  },
  plugins: [],
};
