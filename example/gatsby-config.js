module.exports = {
  siteMetadata: {
    title: `a b c d e f g h i j k l m n`,
    description: `フィギュア、ドール、プログラミング、バイク、音楽についてしゃべる`,
    siteUrl: `https://tenpamk2-blog.netlify.app`, // Must not end with a `/` . See [Gatsby doc](https://www.gatsbyjs.com/docs/location-data-from-props/#getting-the-absolute-url-of-a-page)
    author: {
      name: `tenpaMk2`,
      summary: `インドアクソオタク。`,
    },
    social: {
      twitter: `@tenpaMk2`,
      instagram: `tenpamk2_figure`,
      github: `tenpaMk2`,
    },
    locale: `ja-JP`, // See [Facebook localization doc](https://developers.facebook.com/docs/javascript/internationalization#locales).
    menuLinks: [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "About",
        link: "/about/",
      },
      {
        name: "Archives",
        link: "/archives/",
      },
      {
        name: "Apps",
        link: "/apps/",
      },
      {
        name: "RSS",
        link: "/rss/",
      },
    ],
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: `@tenpamk2/gatsby-theme-figure-blog`,
      options: {
        basePath: ``,
        externalLinks: [
          {
            name: `Asahiwa.jp(よつばとフィギュア)`,
            url: `https://asahiwa.jp/`,
          },
          { name: `ふぃぎゅる！`, url: `http://blog.livedoor.jp/nobuno88/` },
          { name: `fig-memo`, url: `https://fig-memo.com/` },
          {
            name: `Analographicsworks`,
            url: `https://analographics.net/archives/category/figure-review`,
          },
          {
            name: `雪の降る空に`,
            url: `https://yukinofurusorani.livedoor.blog/`,
          },
          {
            name: `mattintosh note`,
            url: `https://mattintosh.hatenablog.com/archive/category/スケールフィギュア`,
          },
          {
            name: `affilabo.com`,
            url: `https://affilabo.com/category/figure/`,
          },
        ],
        locale: `ja-JP`, // See [`Intl.Locale` in MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale).
        pagesPath: `pages`,
        postPath: ``,
      },
    },
  ],
};
