/** @type {import('tailwindcss').Config} */
// Shared design tokens for both Next.js apps (web + admin).
// Colors come straight from the brief: primary/secondary/background/text,
// with white/glass/gradient/shadow treated as the "accent" system rather than fixed hues.
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6F00",
          foreground: "#111111",
        },
        secondary: {
          DEFAULT: "#2F78ED",
          foreground: "#FFFFFF",
        },
        background: "#EBEBEB",
        foreground: "#111111",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F5F3",
        },
        border: "rgba(17, 17, 17, 0.08)",
        glass: {
          light: "rgba(255, 255, 255, 0.6)",
          dark: "rgba(17, 17, 17, 0.5)",
        },
      },
      fontFamily: {
        // Single typeface (Onest) for the whole site — display/sans are kept
        // as separate Tailwind keys for semantic clarity in class names
        // (font-display for headings, font-sans for body copy), but both
        // resolve to the same font file/variable. Weight utilities
        // (font-normal/medium/semibold) do the actual differentiation.
        display: ["var(--font-onest)", "system-ui", "sans-serif"],
        sans: ["var(--font-onest)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Tight cinematic title leading. Reveal masks add their own vertical
        // breathing room in globals.css so large animated headings do not crop.
        "display-2xl": ["clamp(3.5rem, 9vw, 9rem)", { lineHeight: "1.12", letterSpacing: "0" }],
        "display-xl": ["clamp(2.75rem, 6vw, 6rem)", { lineHeight: "1.14", letterSpacing: "0" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1", letterSpacing: "0" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.04", letterSpacing: "0" }],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,17,17,0.04), 0 8px 24px rgba(17,17,17,0.06)",
        "soft-lg": "0 4px 12px rgba(17,17,17,0.06), 0 24px 64px rgba(17,17,17,0.10)",
        glow: "0 0 40px rgba(255,111,0,0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #FF6F00 0%, #2F78ED 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
};
