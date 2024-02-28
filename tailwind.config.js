/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite-react/**/*.js',
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0E9F6E',
        primaryDark: '#057A55',
      },
    },
  },
  plugins: [require('flowbite/plugin'), require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
3
