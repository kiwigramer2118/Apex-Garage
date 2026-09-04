import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Light-mode system, refreshed from the CarFin / Porsche / Renault
        // reference set: warm off-white ground, near-black ink, and an
        // electric-lime accent used for fills/highlights (never as small
        // body text — see `accent.ink` below).
        bg: "#F6F6F1",
        surface: {
          1: "#FFFFFF",
          2: "#EFEFE8",
          3: "#E3E3DA",
        },
        border: {
          DEFAULT: "#DEDED4",
        },
        text: {
          primary: "#16160F",
          secondary: "#5A5A50",
          muted: "#8C8C80",
        },
        accent: {
          DEFAULT: "#B3F22C",
          hover: "#9BDB1A",
          subtle: "#EFFFC8",
          // Deep, legible-on-light-bg green for text/icons that need to
          // read as "accent" — the vivid DEFAULT is reserved for fills,
          // borders, dots and buttons, where its low text-contrast doesn't
          // matter. Referenced via `text-accent-ink`.
          ink: "#4B6B12",
        },
        success: "#0F9D6B",
        danger: "#E0433D",
        // Fixed, theme-independent tokens: `onaccent` is the text color for
        // anything sitting on a solid bg-accent fill (buttons, FAB); `scrim`
        // is the veil under text overlaid on hero photography, kept dark
        // regardless of light/dark theme since photos need a dark gradient
        // either way for light text to stay legible on top of them.
        onaccent: "#12120B",
        scrim: "#0B0B08",
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
        // Generates the `ease-out-fast` utility (Tailwind prefixes this
        // key with `ease-`) used throughout for the 150-200ms, no-bounce
        // motion spec.
        "out-fast": "cubic-bezier(0.16, 1, 0.3, 1)",
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
