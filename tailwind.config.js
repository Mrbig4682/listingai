/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d4fe',
          300: '#a4b8fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#1e1b4b',
        },
        pastel: {
          blue: '#dbeafe',
          indigo: '#e0e7ff',
          purple: '#ede9fe',
          pink: '#fce7f3',
          rose: '#ffe4e6',
          green: '#dcfce7',
          emerald: '#d1fae5',
          teal: '#ccfbf1',
          cyan: '#cffafe',
          sky: '#e0f2fe',
          amber: '#fef3c7',
          orange: '#ffedd5',
          yellow: '#fef9c3',
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
        },
        trust: {
          dark: '#1e293b',
          medium: '#475569',
          light: '#94a3b8',
          muted: '#cbd5e1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'soft-md': '0 4px 6px -1px rgb(0 0 0 / 0.04), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'soft-lg': '0 10px 15px -3px rgb(0 0 0 / 0.04), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
        'glow': '0 0 20px rgb(99 102 241 / 0.15)',
      },
    },
  },
  plugins: [],
}
