/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `${__dirname}/src/pages/**/*.{js,jsx,ts,tsx}`,
    `${__dirname}/src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
