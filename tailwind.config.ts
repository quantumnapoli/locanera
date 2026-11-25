import type { Config } from "tailwindcss";

/**
 * Palette ricavata dall'identità del locale: nero pieno, giallo oro delle
 * cornici delle foto (#FEDA14), arancio del becco dell'oca (#FC6E02).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0a",
          ink: "#141414",
          gold: "#feda14",
          brass: "#d9b45a",
          orange: "#fc6e02",
          cream: "#fbf6e9",
          white: "#ffffff",
          green: "#0f3b2e"
        }
      },
      fontFamily: {
        display: ['"Frank Ruhl Libre"', "Georgia", "serif"],
        body: ['"Barlow"', "system-ui", "sans-serif"],
        label: ['"Barlow Condensed"', '"Barlow"', "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 50px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        glow: "0 30px 80px rgba(254, 218, 20, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
