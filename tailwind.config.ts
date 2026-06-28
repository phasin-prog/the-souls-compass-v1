import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif-thai)", "serif"],
        sans: ["var(--font-sans-thai)", "sans-serif"],
      },
      colors: {
        midnight: "#0B1020",
        "deep-navy": "#101827",
        charcoal: "#171717",
        "surface-1": "#121A2A",
        "surface-2": "#182234",
        "surface-3": "#202B3D",
        ivory: "#F5F0E6",
        "soft-ivory": "#E7DDCC",
        "antique-gold": "#C8A85A",
        bronze: "#9B6B3D",
        "soft-gold": "#D8C58A",
      },
    },
  },
  plugins: [],
};

export default config;
