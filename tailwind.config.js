/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        accent: '#f59e0b',
        surface: {
          dark: '#0f172a',
          light: '#1e293b',
        },
        text: {
          DEFAULT: '#f8fafc',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}
