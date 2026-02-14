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
        primary: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#4CAF50',
        },
        secondary: {
          DEFAULT: '#FBC02D',
          dark: '#F9A825',
          light: '#FDD835',
        },
        surface: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
