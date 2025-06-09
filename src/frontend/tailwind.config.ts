/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    backgroundColor: ({ theme }: { theme: any }) => ({
      ...theme("colors"),
      DEFAULT: "hsl(var(--background-default) / <alpha-value>)",
      "200": "hsl(var(--background-200) / <alpha-value>)",
      alternative: {
        DEFAULT: "hsl(var(--background-alternative-default) / <alpha-value>)",
        "200": "hsl(var(--background-alternative-200) / <alpha-value>)",
      },
      selection: "hsl(var(--background-selection) / <alpha-value>)",
      control: "hsl(var(--background-control) / <alpha-value>)",
      surface: {
        "75": "hsl(var(--background-surface-75) / <alpha-value>)",
        "100": "hsl(var(--background-surface-100) / <alpha-value>)",
        "200": "hsl(var(--background-surface-200) / <alpha-value>)",
        "300": "hsl(var(--background-surface-300) / <alpha-value>)",
        "400": "hsl(var(--background-surface-400) / <alpha-value>)",
      },
      foreground: {
        DEFAULT: "hsl(var(--foreground-default) / <alpha-value>)",
        light: "hsl(var(--foreground-light) / <alpha-value>)",
        lighter: "hsl(var(--foreground-lighter) / <alpha-value>)",
        muted: "hsl(var(--foreground-muted) / <alpha-value>)",
        contrast: "hsl(var(--foreground-contrast) / <alpha-value>)",
      },
      overlay: {
        DEFAULT: "hsl(var(--background-overlay-default) / <alpha-value>)",
        hover: "hsl(var(--background-overlay-hover) / <alpha-value>)",
      },
      muted: "hsl(var(--background-muted) / <alpha-value>)",
      button: "hsl(var(--background-button-default) / <alpha-value>)",
      dialog: "hsl(var(--background-dialog-default) / <alpha-value>)",
      "dash-sidebar": "hsl(var(--background-dash-sidebar) / <alpha-value>)",
      "dash-canvas": "hsl(var(--background-dash-canvas) / <alpha-value>)",
    }),

    borderColor: ({ theme }: { theme: any }) => ({
      ...theme("colors"),
      DEFAULT: "hsl(var(--border-default) / <alpha-value>)",
      muted: "hsl(var(--border-muted) / <alpha-value>)",
      secondary: "hsl(var(--border-secondary) / <alpha-value>)",
      overlay: "hsl(var(--border-overlay) / <alpha-value>)",
      control: "hsl(var(--border-control) / <alpha-value>)",
      default: "hsl(var(--border-default) / <alpha-value>)",
      alternative: "hsl(var(--border-alternative) / <alpha-value>)",
      strong: "hsl(var(--border-strong) / <alpha-value>)",
      stronger: "hsl(var(--border-stronger) / <alpha-value>)",
      button: {
        DEFAULT: "hsl(var(--border-button-default) / <alpha-value>)",
        hover: "hsl(var(--border-button-hover) / <alpha-value>)",
      },
    }),

    textColor: ({ theme }: { theme: any }) => ({
      ...theme("colors"),
      foreground: {
        DEFAULT: "hsl(var(--foreground-default) / <alpha-value>)",
        light: "hsl(var(--foreground-light) / <alpha-value>)",
        lighter: "hsl(var(--foreground-lighter) / <alpha-value>)",
        muted: "hsl(var(--foreground-muted) / <alpha-value>)",
        contrast: "hsl(var(--foreground-contrast) / <alpha-value>)",
      },
    }),
    extend: {
      colors: {
        border: {
          DEFAULT: "hsl(var(--border-default) / <alpha-value>)",
          muted: "hsl(var(--border-muted) / <alpha-value>)",
          secondary: "hsl(var(--border-secondary) / <alpha-value>)",
          overlay: "hsl(var(--border-overlay) / <alpha-value>)",
          control: "hsl(var(--border-control) / <alpha-value>)",
          alternative: "hsl(var(--border-alternative) / <alpha-value>)",
          strong: "hsl(var(--border-strong) / <alpha-value>)",
          stronger: "hsl(var(--border-stronger) / <alpha-value>)",
          button: {
            DEFAULT: "hsl(var(--border-button-default) / <alpha-value>)",
            hover: "hsl(var(--border-button-hover) / <alpha-value>)",
          },
        },
        // Brand colors
        brand: {
          DEFAULT: "hsl(var(--brand-default) / <alpha-value>) ",
          button: "hsl(var(--brand-button) / <alpha-value>)",
          link: "hsl(var(--brand-link) / <alpha-value>)",
          "200": "hsl(var(--brand-200) / <alpha-value>)",
          "300": "hsl(var(--brand-300) / <alpha-value>)",
          "400": "hsl(var(--brand-400) / <alpha-value>)",
          "500": "hsl(var(--brand-500) / <alpha-value>)",
          "600": "hsl(var(--brand-600) / <alpha-value>)",
        },

        // Other color variables
        black: "hsl(var(--colors-black) / <alpha-value>)",
        white: "hsl(var(--colors-white) / <alpha-value>)",
        "gray-1100": "hsl(var(--colors-gray-1100) / <alpha-value>)",
        "gray-dark": {
          "100": "hsl(var(--colors-gray-dark-100) / <alpha-value>)",
          "200": "hsl(var(--colors-gray-dark-200) / <alpha-value>)",
        },
        "gray-light": {
          "100": "hsl(var(--colors-gray-light-100) / <alpha-value>)",
          "200": "hsl(var(--colors-gray-light-200) / <alpha-value>)",
        },
        "slate-dark": {
          "100": "hsl(var(--colors-slate-dark-100) / <alpha-value>)",
          "200": "hsl(var(--colors-slate-dark-200) / <alpha-value>)",
        },
        "slate-light": {
          "100": "hsl(var(--colors-slate-light-100) / <alpha-value>)",
          "200": "hsl(var(--colors-slate-light-200) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive-default) / <alpha-value>)",
          "200": "hsl(var(--destructive-200) / <alpha-value>)",
          "300": "hsl(var(--destructive-300) / <alpha-value>)",
          "400": "hsl(var(--destructive-400) / <alpha-value>)",
          "500": "hsl(var(--destructive-500) / <alpha-value>)",
          "600": "hsl(var(--destructive-600) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning-default) / <alpha-value>)",
          "200": "hsl(var(--warning-200) / <alpha-value>)",
          "300": "hsl(var(--warning-300) / <alpha-value>)",
          "400": "hsl(var(--warning-400) / <alpha-value>)",
          "500": "hsl(var(--warning-500) / <alpha-value>)",
          "600": "hsl(var(--warning-600) / <alpha-value>)",
        },
        _secondary: {
          DEFAULT: "hsl(var(--secondary-default) / <alpha-value>)",
          "200": "hsl(var(--secondary-200) / <alpha-value>)",
          "400": "hsl(var(--secondary-400) / <alpha-value>)",
        },
        studio: "hsl(var(--background-200))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      width: {
        listbox: "var(--width-listbox);",
      },
      keyframes: {
        "flash-code": {
          "0%": { backgroundColor: "rgba(63, 207, 142, 0.1)" },
          "100%": { backgroundColor: "transparent" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "flash-code": "flash-code 1s forwards",
        "flash-code-slow": "flash-code 2s forwards",
        "accordion-down": "accordion-down 0.15s ease-out",
        "accordion-up": "accordion-up 0.15s ease-out",
        "collapsible-down": "collapsible-down 0.10s ease-out",
        "collapsible-up": "collapsible-up 0.10s ease-out",
      },
      borderRadius: {
        panel: "6px",
      },
      padding: {
        content: "21px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
