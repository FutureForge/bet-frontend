import { text } from "stream/consumers";
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        instrument: ["var(--font-instrument)", ...fontFamily.sans],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        stroke: "var(--stroke)",
        secondary: "var(--secondary)",
        muted: "var(--muted)",
        'muted-foreground': "var(--muted-forground)",
        badge: {
          primary: "var(--badge-primary)",
          secondary: {
            DEFAULT: "var(--badge-secondary)",
            text: "var(--warning)",
          },
        },
      },

      keyframes: {
        gauge_fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        gauge_fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        pulse_bg: {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "0" },
        },
        pulse_slow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.2" },
        },
        gauge_fill: {
          from: { "stroke-dashoffset": "332", opacity: "0" },
          to: { opacity: "1" },
        },
        slideDown: {
          from: { maxHeight: "0px" },
          to: { maxHeight: "400px" },
        },
        slideUp: {
          to: { maxHeight: "0px" },
          from: { maxHeight: "400px" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: "translateY(-2px)" },
          to: { opacity: '1', transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: "translateX(2px)" },
          to: { opacity: '1', transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: "translateY(2px)" },
          to: { opacity: '1', transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: "translateX(-2px)" },
          to: { opacity: '1', transform: "translateX(0)" },
        },
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        overlayHide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        dialogShow: {
          from: { opacity: '0', transform: "translateY(8px) scale(0.97)" },
          to: { opacity: '1', transform: "translateY(0) scale(1)" },
        },
        dialogHide: {
          from: { opacity: '1', transform: "translateY(0) scale(1)" },
          to: { opacity: '0', transform: "translateY(8px) scale(0.97)" },
        },

        "slide-from-top": {
          from: { transform: "translateY(4px) scale(0.97)", opacity: '0' },
          to: { transform: "translateY(0) scale(1)", opacity: '1' },
        },
        "slide-to-top": {
          from: { transform: "translateY(0) scale(1)", opacity: '1' },
          to: { transform: "translateY(4px) scale(0.97)", opacity: '0' },
        },
        "slide-from-bottom": {
          from: { transform: "translateY(-4px) scale(0.97)", opacity: '0' },
          to: { transform: "translateY(0) scale(1)", opacity: '1' },
        },
        "slide-to-bottom": {
          from: { transform: "translateY(0) scale(1)", opacity: '1' },
          to: { transform: "translateY(-4px) scale(0.97)", opacity: '0' },
        },
        "slide-from-left": {
          from: { transform: "translateX(4px) scale(0.97)", opacity: '0' },
          to: { transform: "translateX(0) scale(1)", opacity: '1' },
        },
        "slide-to-left": {
          from: { transform: "translateX(0) scale(1)", opacity: '1' },
          to: { transform: "translateX(4px) scale(0.97)", opacity: '0' },
        },
        "slide-from-right": {
          from: { transform: "translateX(-4px) scale(0.97)", opacity: '0' },
          to: { transform: "translateX(0) scale(1)", opacity: '1' },
        },
        "slide-to-right": {
          from: { transform: "translateX(0) scale(1)", opacity: '1' },
          to: { transform: "translateX(-4px) scale(0.97)", opacity: '0' },
        },
        "fade-in-out": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        // fade_in: {
        //   from: { transform: 'translateY(80%)', opacity: '0' },
        //   to: { transform: 'translateY(0)', opacity: '1' },
        // },
        // fade_out: {
        //   from: { transform: 'translateY(0)', opacity: '1' },
        //   to: { transform: 'translateY(100%)', opacity: '0' },
        // },
        // overlayShow: {
        //   from: { opacity: '0' },
        //   to: { opacity: '1' },
        // },
        // contentShow: {
        //   from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
        //   to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        // },
      },
      animation: {
        gauge_fadeIn: "gauge_fadeIn 0.40s ease forwards",
        gauge_fadeOut: "gauge_fadeOut 0.40s ease forwards",
        pulse_bg: "pulse_bg 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        pulse_slow: "pulse_slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        gauge_fill: "gauge_fill 1s ease forwards",
        slideDown: "slideDown 150ms ease-in forwards",
        slideUp: "slideUp 150ms ease-in forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        overlayShow: "overlayShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        overlayHide: "overlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogShow: "dialogShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogHide: "dialogHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-out": "fade-in-out 1s infinite",
        // fade_in: 'fade_in 0.8s ease-in-out forwards',
        // fade_out: 'fade_out 0.8s ease-in-out forwards',
        // overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        // contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',

        "slide-from-top": "slide-from-top 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-to-top": "slide-to-top 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-from-bottom":
          "slide-from-bottom 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-to-bottom":
          "slide-to-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-from-left":
          "slide-from-left 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-to-left": "slide-to-left 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-from-right":
          "slide-from-right 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-to-right": "slide-to-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
export default config;
