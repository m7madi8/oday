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
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        sub: ["var(--font-sub)", "General Sans", "system-ui", "sans-serif"],
        ui: ["var(--font-ui)", "General Sans", "system-ui", "sans-serif"],
        sans: ["var(--font-ui)", "General Sans", "system-ui", "sans-serif"],
        body: ["var(--font-ui)", "General Sans", "system-ui", "sans-serif"],
        outfit: ["var(--font-ui)", "General Sans", "system-ui", "sans-serif"],
        /* Legacy aliases */
        viga: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        cairo: ["var(--font-ui)", "General Sans", "system-ui", "sans-serif"],
        "hero-accent": ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        "hero-display": ["var(--font-display)", "Fraunces", "Georgia", "serif"],
      },
      fontWeight: {
        hairline: "200",
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
