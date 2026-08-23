/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cobalt: '#2563eb',
          'cobalt-dark': '#1d4ed8',
          'cobalt-light': '#eff6ff',
          slate: '#0f172a',
          emerald: '#059669',
          'emerald-light': '#ecfdf5',
          amber: '#d97706',
          surface: '#ffffff',
          warm: '#f8fafc',
          card: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
