import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0B1020",
        "deep-navy": "#101827",
        charcoal: "#171717",
        "surface-1": "#121A2A",
        "surface-2": "#182234",
        "surface-3": "#202B3D",
        ivory: "#F5F0E6",
        "soft-ivory": "#E7DDCC",
        muted: "#A8A29E",
        subtle: "#78716C",
        "antique-gold": "#C8A85A",
        bronze: "#9B6B3D",
        "soft-gold": "#D8C58A",
        success: "#7A9B76",
        warning: "#C2A15A",
        danger: "#B46A5A",
        info: "#6F8FAF",
      },
      fontFamily: {
        serif: ["Noto Serif Thai", "Georgia", "serif"],
        sans: ["IBM Plex Sans Thai", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        md: "1.0625rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        "4xl": "3.25rem",
      },
      lineHeight: {
        tight: "1.2",
        heading: "1.35",
        body: "1.75",
        reading: "1.85",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(0, 0, 0, 0.24)",
        card: "0 12px 34px rgba(0, 0, 0, 0.20)",
      },
      maxWidth: {
        reading: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
