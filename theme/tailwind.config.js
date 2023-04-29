const path = require(`path`);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // See [Tailwind CSS | Working with third-party tools](https://tailwindcss.com/docs/content-configuration#working-with-third-party-libraries) .
    path.join(
      path.dirname(require.resolve(`@tenpamk2/gatsby-theme-figure-blog`)),
      "**/*.{js,jsx,mjs,ts,tsx}"
    ),
  ],
  theme: {
    fontSize: {
      xs: [`0.75rem`, { lineHeight: `1rem` }], // default
      sm: [`0.875rem`, { lineHeight: `1.25rem` }], // default
      base: [`1rem`, { lineHeight: `1.5rem` }], // default
      lg: [`1.125rem`, { lineHeight: `1.75rem` }], // default
      xl: [`1.25rem`, { lineHeight: `1.75rem` }], // default
      "2xl": [`1.5rem`, { lineHeight: `2rem` }], // default
      "3xl": [`1.875rem`, { lineHeight: `2.45rem` }],
      "4xl": [`2.25rem`, { lineHeight: `2.95rem` }],
      "5xl": [`3rem`, { lineHeight: `3.85rem` }],
      "6xl": [`3.75rem`, { lineHeight: `4.85rem` }],
      "7xl": [`4.5rem`, { lineHeight: `5.85rem` }],
      "8xl": [`6rem`, { lineHeight: `7.85rem` }],
      "9xl": [`8rem`, { lineHeight: `10.55rem` }],
    },
    extend: {
      dropShadow: {
        title: [
          `0 1px 1px rgb(100% 100% 100% / .8)`,
          `0 2px 3px rgb(0% 0% 0% / .5)`,
          `0 0px 20px rgb(0% 0% 0% / 1)`,
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            ".gatsby-resp-image-wrapper": {
              boxShadow: `0 0 1rem rgb(0% 0% 0% / .5)`,
              borderRadius: `0.5rem`,
              overflow: `hidden`,
            },
            blockquote: {
              backgroundColor: `rgb(50% 50% 50% / .2)`,
              borderLeftColor: `rgb(3 105 161)`, // sky-700
              borderRadius: `0.375rem`,
              padding: `1px 1rem`,
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
            hr: {
              borderColor: `rgb(100 116 139)`, // slate-500
            },
            table: {
              display: `block`,
              width: `max-content`,
              maxWidth: `100%`,
              fontSize: `1rem`,
              borderRadius: `0.5rem`,
              overflow: `auto`,
            },
            "th, td": {
              padding: `0.25rem 1rem`,
            },
            "thead > tr": {
              backgroundColor: `rgb(100% 100% 100% / .1)`,
            },
            "tbody > tr:nth-child(odd)": {
              backgroundColor: `rgb(0% 0% 0% / .1)`,
            },
            "tbody > tr:nth-child(even)": {
              backgroundColor: `rgb(0% 0% 0% / .2)`,
            },
            "ul > li::marker": {
              color: `var(--tw-prose-links)`,
            },
          },
        },
      },
    },
  },
  plugins: [require(`@tailwindcss/typography`)],
};
