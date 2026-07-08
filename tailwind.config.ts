import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        moss: "#315348",
        mint: "#d8f1e4",
        amberline: "#f6b84f",
        paper: "#f7f5ef"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 27, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
