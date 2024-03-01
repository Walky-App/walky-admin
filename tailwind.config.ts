import { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

const config: Config = {
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
      },
    },
  },
  plugins: [flowbitePlugin, formsPlugin, typographyPlugin],
};

export default config;