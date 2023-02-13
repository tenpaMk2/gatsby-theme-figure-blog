module.exports = {
  siteMetadata: {
    title: `tenpaMk2's blog`,
    description: `フィギュア、ドール、プログラミング、バイク、音楽についてしゃべる`,
    siteUrl: `https://tenpamk2-blog.netlify.app`, // must not end with a `/` . See [Gatsby doc](https://www.gatsbyjs.com/docs/location-data-from-props/#getting-the-absolute-url-of-a-page)
    author: {
      name: `tenpaMk2`,
      summary: `インドアクソオタク。`,
    },
    social: {
      twitter: `@tenpaMk2`,
      instagram: `tenpamk2_figure`,
      github: `tenpaMk2`,
    },
    locale: `ja-JP`, // see [facebook localization doc](https://developers.facebook.com/docs/javascript/internationalization#locales).
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: `@tenpamk2/gatsby-theme-figure-blog`,
      options: {
        basePath: `b`,
        locale: `ja-JP`, // See [`Intl.Locale in MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale).
        postPath: `p`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- more -->`,
      },
    },
  ],
};
