import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#FFCE0A",
        borderGray: "#27272A"
      },
      boxShadow: {
        defaultBackdrop: "0 -100px 1000px 200px rgba(200, 200, 200, 0.2)",
        primaryBackdrop: '0 -100px 1000px 200px rgba(255, 206, 10, 0.2)',
        successBackdrop: '0 -100px 1000px 200px rgba(80, 200, 80, 0.2)',
        failureBackdrop: '0 -100px 1000px 200px rgba(200, 80, 80, 0.2)',
        connectWalletButtonBackdrop: '0 0 100px 30px rgba(255, 206, 10, 0.2)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
