import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",
        surface: {
          1: "#131315",
          2: "#1A1A1C",
          3: "#202023",
        },
        border: {
          DEFAULT: "#2A2A2C",
        },
        text: {
          primary: "#F5F5F4",
          secondary: "#9A9A9C",
          muted: "#6B6B6D",
        },
        accent: {
          DEFAULT: "#FF7A45",
          hover: "#E85F2C",
          subtle: "#2A180E",
        },
        success: "#4A9B6E",
        danger: "#E24B4A",
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        pill: "999px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "24px",
        6: "32px",
        7: "48px",
        8: "64px",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        ui: ["var(--font-ui)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["32px", { lineHeight: "40px", fontWeight: "500" }],
        title: ["22px", { lineHeight: "28px", fontWeight: "500" }],
        heading: ["18px", { lineHeight: "24px", fontWeight: "500" }],
        body: ["15px", { lineHeight: "22px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },
      transitionTimingFunction: {
        "ease-out-fast": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "50%": { transform: "scale(1.6)", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-live": "pulse-live 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "fade-in": "fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fade-in-up 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
