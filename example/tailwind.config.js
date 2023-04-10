// Maybe, Gatsby cannot handle multiple tailwind.config.js files,
// so you need to merge them.

const defaultOptions = require(`@tenpamk2/gatsby-theme-figure-blog/tailwind.config.js`);

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...defaultOptions,
  ...{
    content: [...defaultOptions.content, `./src/**/*.{js,jsx,mjs,ts,tsx}`],
  },
};
