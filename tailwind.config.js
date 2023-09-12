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
        primary: { DEFAULT: '#30007E', light: '#F6F1FF' },
        gray: {
          background: '#F9F9FB',
          light: '#ececec',
          semilight: '#C4C4C4',
          extradark: '#242731',
        },
      },
    },
  },
  plugins: [require('@headlessui/tailwindcss')],
};
