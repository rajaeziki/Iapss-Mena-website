import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1e2c50", 50: "#f1f4fb", 100: "#e1e7f5", 500: "#3a4f8f", 600: "#2b3d72", 700: "#1e2c50" },
        teal2: "#0e7c86",
      },
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"], serif: ["var(--font-fraunces)", "Georgia", "serif"] },
      boxShadow: { soft: "0 10px 30px -14px rgba(20,24,31,.25)" },
    },
  },
  plugins: [],
};
export default config;
