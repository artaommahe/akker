const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    colors: {
      action: { primary: '#2984a5', secondary: '#9a90b4' },
      semantic: { success: '#8db14b', warning: '#fca321', danger: '#dd452e' },
    },
    fontFamily: { sans: ['"Roboto"', ...defaultTheme.fontFamily.sans] },
    extend: {
      textColor: { primary: '#f7f5f1', secondary: '#a5a096', inverse: '#313231' },
      backgroundColor: { primary: '#313231', secondary: '#3a3b3b', tertiary: '#5d6263', inverse: '#f7f5f1' },
      borderColor: { primary: '#f7f5f1', secondary: '#a5a096', transparent: 'transparent' },
      caretColor: { primary: '#f7f5f1' },
    },
  },
  plugins: [],
};
