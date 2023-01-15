/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `${__dirname}/src/components/**/*.{js,jsx,ts,tsx}`,
    `${__dirname}/src/pages/**/*.{js,jsx,ts,tsx}`,
    `${__dirname}/src/templates/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              backgroundColor: `rgba(128, 128, 128, 0.2)`,
              overflow: `hidden`,
              quotes: null,
            },
            "blockquote p:first-of-type::before": {
              content: null,
            },
            "blockquote p:last-of-type::after": {
              content: null,
            },
            "code::before": {
              content: null,
            },
            "code::after": {
              content: null,
            },
          },
        },
      },
    },
  },
  plugins: [require(`@tailwindcss/typography`)],
};