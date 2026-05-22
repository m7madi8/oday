import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        md: "768px",
        lg: "1024px",
      },
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
        },
        gold: {
          DEFAULT: "var(--accent-gold)",
          dim: "var(--accent-gold-dim)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        edge: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        "hero-accent": ["var(--font-hero-accent)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-dm)", "DM Sans", "system-ui", "sans-serif"],
        outfit: ["var(--font-outfit)", "Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-glow":
          "linear-gradient(180deg, rgba(245,197,24,0.14) 0%, transparent 55%)",
      },
    },
  },
  plugins: [],
};
export default config;
