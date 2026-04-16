/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Corporate/Minimalista — matching web theme.css
        primary: {
          DEFAULT: '#1f2937',   // gray-800
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f3f4f6',   // gray-100
          foreground: '#1f2937',
        },
        muted: {
          DEFAULT: '#f9fafb',   // gray-50
          foreground: '#6b7280', // gray-500
        },
        accent: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: '#e5e7eb',       // gray-200
        input: '#e5e7eb',
        ring: '#1f2937',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        // Keep indigo mapped to the corporate gray primary for backward compat
        indigo: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#1f2937',
          700: '#1f2937',
          800: '#1f2937',
          900: '#111827',
        },
        // Pastel aliases → corporate grays
        pastel: {
          bg: '#f9fafb',
          purple: '#f3f4f6',
          pink: '#FCE7F3',
          mint: '#D1FAE5',
          yellow: '#FEF9C3',
          blue: '#DBEAFE',
          orange: '#FFEDD5',
          rose: '#FFE4E6',
          card: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
