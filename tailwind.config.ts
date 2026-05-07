import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        navy: {
          50: "#f0f4fb",
          100: "#dbe6f6",
          200: "#b8cdec",
          300: "#8caede",
          400: "#5d8dcd",
          500: "#3a6fb8",
          600: "#2c599a",
          700: "#24477b",
          800: "#1e3a64",
          900: "#172d4f",
          950: "#0f1f3a",
        },
      },
      boxShadow: {
        soft: "0 1px 0 rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
