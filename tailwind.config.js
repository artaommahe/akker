const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    colors: {
      text: {
        primary: colors.slate['900'],
        secondary: colors.slate['500'],
      },
      background: {
        primary: colors.neutral['50'],
      },
      support: colors.neutral['950'],
    },
    extend: {},
  },
  plugins: [],
};
