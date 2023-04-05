/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `${__dirname}/src/components/**/*.{js,jsx,mjs,ts,tsx}`,
    `${__dirname}/src/pages/**/*.{js,jsx,mjs,ts,tsx}`,
    `${__dirname}/src/templates/**/*.{js,jsx,mjs,ts,tsx}`,
  ],
  theme: {
    extend: {
      dropShadow: {
        title: [
          "0 1px 1px rgba(255,255,255,0.8)",
          "0 2px 3px rgba(0, 0, 0, 0.5)",
          "0 0px 20px rgba(0, 0, 0, 1)",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            ".gatsby-resp-image-wrapper": {
              "box-shadow": "0 0 1rem rgba(0, 0, 0, 0.5)",
              "border-radius": "0.5rem",
              overflow: "hidden",
            },
            blockquote: {
              backgroundColor: `rgba(128, 128, 128, 0.2)`,
              "border-left-color": `rgb(3, 105, 161)`, // sky-700
              "border-radius": `0.375rem`,
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
              "border-color": `rgb(100, 116, 139)`, // slate-500
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
              backgroundColor: `rgb(100%, 100%, 100%, 0.1)`,
            },
            "tbody > tr:nth-child(odd)": {
              backgroundColor: `rgb(0%, 0%, 0%, 0.10)`,
            },
            "tbody > tr:nth-child(even)": {
              backgroundColor: `rgb(0%, 0%, 0%, 0.20)`,
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
