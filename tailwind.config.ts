import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050507",
          900: "#07070B",
          850: "#0B0A12",
          800: "#0E0D18",
        },
        glow: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      keyframes: {
        breath: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.98)" },
          "50%": { opacity: "0.6", transform: "scale(1.03)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        breath: "breath 6.5s ease-in-out infinite",
        floaty: "floaty 10s ease-in-out infinite",
      },
      boxShadow: {
        "glow-soft": "0 0 0 1px rgba(139, 92, 246, 0.12), 0 18px 60px rgba(124, 58, 237, 0.12)",
        "card-inset":
          "inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 40px rgba(124, 58, 237, 0.08)",
      },
      fontFamily: {
        serif: [
          "ui-serif",
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "Cormorant Garamond",
          "Georgia",
          "serif",
        ],
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        ritual: "0.08em",
      },
    },
  },
  plugins: [],
} satisfies Config;
