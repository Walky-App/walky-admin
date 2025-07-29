import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-coreui-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#321fdb',
          secondary: '#9da5b1',
          success: '#2eb85c',
          info: '#39f',
          warning: '#f9b115',
          danger: '#e55353',
          light: '#ebedef',
          dark: '#4f5d73',
        },
        coreui: {
          'body-bg': 'var(--cui-body-bg)',
          'body-color': 'var(--cui-body-color)',
          'card-bg': 'var(--cui-card-bg)',
          'border': 'var(--cui-border-color)',
        }
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-to-top": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        "slide-out-to-bottom": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        "slide-out-to-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "slide-out-to-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-out": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.95)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "spin": {
          "to": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "in": "in 150ms ease-out",
        "out": "out 150ms ease-in",
        "fade-in": "fade-in 150ms ease-out",
        "fade-out": "fade-out 150ms ease-in",
        "zoom-in": "zoom-in 150ms ease-out",
        "zoom-out": "zoom-out 150ms ease-in",
        "spin": "spin 1s linear infinite",
        "slide-in-from-top": "slide-in-from-top 200ms ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 200ms ease-out",
        "slide-in-from-left": "slide-in-from-left 200ms ease-out",
        "slide-in-from-right": "slide-in-from-right 200ms ease-out",
        "slide-out-to-top": "slide-out-to-top 200ms ease-in",
        "slide-out-to-bottom": "slide-out-to-bottom 200ms ease-in",
        "slide-out-to-left": "slide-out-to-left 200ms ease-in",
        "slide-out-to-right": "slide-out-to-right 200ms ease-in",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}