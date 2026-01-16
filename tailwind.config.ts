import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        inter: ["Inter", "sans-serif"],
        geistSans: ["var(--font-geist-sans)"],
      },
      colors: {
        // Midnight Mystery Palette
        midnight: {
          DEFAULT: "#0f0f0f",
          light: "#1a1a1a",
          card: "rgba(30, 30, 30, 0.8)",
        },
        purple: {
          DEFAULT: "#8b5cf6",
          dark: "#7c3aed",
          light: "#a78bfa",
        },
        gold: {
          DEFAULT: "#fbbf24",
          light: "#fde047",
          dark: "#f59e0b",
        },
        // Keep existing colors for compatibility
        primary: {
          DEFAULT: "#8066FF",
          100: "#6248E1",
          200: "#8066FF",
        },
        dark: {
          DEFAULT: "#141517",
          100: "#414141",
          200: "#121212",
          300: "#676B71",
        },
        main: {
          DEFAULT: "#E1DEF0",
          100: "#F3EFFD",
        },
      },
      keyframes: {
        "fade-effect": {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "slide-down": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        loader: {
          "0%": {
            opacity: "0.2",
          },
          "100%": {
            opacity: "1",
          },
        },
        spin: {},
      },
      animation: {
        "fade-in": "fade-effect 300ms linear",
        "slide-down": "slide-down 300ms linear forwards",
        "slide-up": "slide-up 300ms linear forwards",
        "shake": "shake 0.4s ease-in-out",
        "pulse-slow": "pulse 2s ease-in-out infinite",
        "rotate-clockwise": "rotate-clockwise 1s infinite linear",
        "loader-opacity": "loader 1s ease-in-out alternate infinite",
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;

