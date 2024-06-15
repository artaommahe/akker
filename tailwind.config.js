const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    colors: {},
    textColor: {
      primary: colors.slate['900'],
      secondary: colors.slate['500'],
    },
    backgroundColor: {
      primary: colors.neutral['50'],
    },
    borderColor: {
      primary: colors.neutral['950'],
    },
    extend: {},
  },
  plugins: [],
};
