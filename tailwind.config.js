/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        "primary-hover": "#2563eb",
        "background-dark": "#09090b",
        "surface-dark": "#121215",
        "sidebar-dark": "#0c0c0e",
        "border-dark": "#27272a",
        "text-secondary": "#a1a1aa",
        "text-primary": "#f4f4f5",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px -5px rgba(59, 130, 246, 0.15)",
      },
    },
  },
  plugins: [],
};
