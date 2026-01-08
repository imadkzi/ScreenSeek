/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "space-gray": "#2c2c2e",
        "space-gray-light": "#3a3a3c",
        "space-gray-dark": "#1c1c1e",
        "apple-glass": "rgba(255, 255, 255, 0.2)",
        "apple-glass-dark": "rgba(0, 0, 0, 0.15)",
        accent: "#007AFF", // Apple blue accent
      },
      backdropBlur: {
        glass: "20px",
      },
      backgroundImage: {
        glass:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      },
    },
  },
  plugins: [],
};
