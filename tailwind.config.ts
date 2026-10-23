import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#061a3b", 50: "#edf5f7", 100: "#dbe9ee", 500: "#0a2a57", 600: "#082247", 700: "#061a3b" },
        cyan: "#00aeb4",
        paper: "#f4f1ea",
        sand: "#e9e2d3",
        sky: "#74d9dc",
        teal2: "#08868b",
      },
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"], serif: ["var(--font-fraunces)", "Georgia", "serif"] },
      boxShadow: { soft: "0 10px 30px -14px rgba(20,24,31,.25)" },
    },
  },
  plugins: [],
};
export default config;
