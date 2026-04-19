/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: '#0d9488', light: '#5eead4', dark: '#0f766e' },
        surface: { DEFAULT: '#f8fafc', dark: '#0f172a' },
        border: { DEFAULT: '#e2e8f0', dark: '#1e293b' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
