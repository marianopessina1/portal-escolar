import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0806",
        coal: "#14100d",
        smoke: "#221b16",
        fuego: "#ff5b14",
        brasa: "#ff8a1f",
        ambar: "#ffb341",
        crema: "#f5ebdc",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        mega: ["clamp(5rem, 22vw, 26rem)", { lineHeight: "0.82", letterSpacing: "-0.02em" }],
        giant: ["clamp(3.5rem, 11vw, 12rem)", { lineHeight: "0.86", letterSpacing: "-0.01em" }],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
