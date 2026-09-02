/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: "#0F766E",
          mint: "#10B981",
        },
        gold: {
          DEFAULT: "#D97706",
          light: "#F59E0B",
        },
        ink: {
          page: "rgb(var(--c-ink-page) / <alpha-value>)",
          card: "rgb(var(--c-ink-card) / <alpha-value>)",
          border: "rgb(var(--c-ink-border) / <alpha-value>)",
          hover: "rgb(var(--c-ink-hover) / <alpha-value>)",
          text: "rgb(var(--c-ink-text) / <alpha-value>)",
          overlay: "rgb(var(--c-ink-overlay) / <alpha-value>)",
          faint: "rgb(var(--c-slate-300) / <alpha-value>)",
          muted: "rgb(var(--c-slate-400) / <alpha-value>)",
          subtle: "rgb(var(--c-slate-500) / <alpha-value>)",
        },
        slate: {
          200: "rgb(var(--c-slate-200) / <alpha-value>)",
          300: "rgb(var(--c-slate-300) / <alpha-value>)",
          400: "rgb(var(--c-slate-400) / <alpha-value>)",
          500: "rgb(var(--c-slate-500) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ['"Scheherazade New"', '"Amiri"', "serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(16,185,129,0.25)",
        "glow-gold": "0 0 24px rgba(217,119,6,0.30)",
        glass: "0 8px 32px rgba(0,0,0,0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        shimmer: "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};
