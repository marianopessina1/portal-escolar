import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abismo: "#05080d",
        tinta: "#0a111a",
        marea: "#13202c",
        oro: "#d9b064",
        dorado: "#f3dd9f",
        cobre: "#a8742f",
        ocaso: "#ff7a2f",
        sangre: "#9b2c1c",
        pergamino: "#efe3c8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        mega: ["clamp(4rem, 15vw, 17rem)", { lineHeight: "0.86", letterSpacing: "-0.01em" }],
        giant: ["clamp(3rem, 9vw, 9.5rem)", { lineHeight: "0.9" }],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
