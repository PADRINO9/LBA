import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F3EC",
        ink: "#1E2424",
        muted: "#6F6A61",
        accent: "#1A5866",
        "accent-dark": "#103A44",
        line: "#E5DDD2",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(30, 36, 36, 0.08)",
        card: "0 10px 30px rgba(26, 88, 102, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-heebo)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
