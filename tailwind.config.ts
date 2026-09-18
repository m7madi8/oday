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
        display: ["var(--font-display)", "Bodoni Moda", "Georgia", "serif"],
        sub: ["var(--font-ui)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        ui: ["var(--font-ui)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        sans: ["var(--font-ui)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["var(--font-ui)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "monospace"],
        /* Legacy aliases */
        outfit: ["var(--font-ui)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        viga: ["var(--font-display)", "Bodoni Moda", "Georgia", "serif"],
        cairo: ["var(--font-ui)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        "hero-accent": ["var(--font-display)", "Bodoni Moda", "Georgia", "serif"],
        "hero-display": ["var(--font-display)", "Bodoni Moda", "Georgia", "serif"],
      },
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.5" }],
        sm: ["var(--step-0)", { lineHeight: "1.75" }],
        base: ["var(--step-1)", { lineHeight: "1.75" }],
        lg: ["1.25rem", { lineHeight: "1.65" }],
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
