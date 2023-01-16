module.exports = {
  siteMetadata: {
    title: `tenpaMk2's blog`,
    description: `フィギュア、ドール、プログラミング、バイク、音楽についてしゃべる`,
    siteUrl: `https://tenpamk2-blog.netlify.app/`, // Must append trailing `/` . TODO: After querying, trailing `/` is dissapeard. Does it affect?
    author: {
      name: `tenpaMk2`,
      summary: `インドアクソオタク。`,
    },
    social: {
      twitter: `@tenpaMk2`,
    },
    locale: `ja-JP`, // see [facebook localization doc](https://developers.facebook.com/docs/javascript/internationalization#locales).
  },
  plugins: [
    "gatsby-plugin-postcss",
    { resolve: `@tenpamk2/gatsby-theme-figure-blog`, options: {} },
  ],
};
