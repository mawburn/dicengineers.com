/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        header: ['var(--font-kanit)'],
        mono: ['var(--font-ubuntu-mono)'],
        bodyFont: ['var(--font-ubuntu)'],
      },
      colors: {
        darkSecondary: '#363B4E',
        darkPrimary: '#15161B',
        darken: 'rgba(21, 22, 27, .75)',
        light: '#FDFDFD',
        primary: '#68ACDD',
        primaryDark: '#578CB2',
        secondary: '#165DC0',
        discord: '#5765F2',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
