import type { Config } from "tailwindcss";

// Spacing scale ONLY: 8, 16, 24, 32, 48, 64, 96, 128 (class number = px, e.g. gap-24).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    spacing: {
      0: "0px",
      px: "1px",
      8: "8px",
      16: "16px",
      24: "24px",
      32: "32px",
      48: "48px",
      64: "64px",
      96: "96px",
      128: "128px",
    },
    extend: {
      colors: {
        ink: "var(--text)",
        secondary: "var(--secondary)",
        page: "var(--page)",
        soft: "var(--soft)",
        sand: "var(--sand)",
        honey: "var(--honey)",
        amber: "var(--amber)",
        live: "var(--green)",
        copper: "var(--copper)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
