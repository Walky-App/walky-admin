/* eslint-disable */
import fs from 'fs'
import postcss from 'postcss'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  corePlugins: {
    preflight: false,
  },
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
        primaryDarker: '#0A5F3C',
        primaryLight: '#81C44F',
      },
      backgroundColor: {
        'black-60': 'rgba(0, 0, 0, 0.6)',
      },
    },
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addBase }) => {
      const styles = postcss.parse(fs.readFileSync(require.resolve('./src/reset.css'), 'utf8'))
      addBase(styles.nodes)
    }),
  ],
  darkMode: 'selector',
}
