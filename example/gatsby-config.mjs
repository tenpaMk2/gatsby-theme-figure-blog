export default {
  siteMetadata: {
    title: `Gatsby figure blog theme`,
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
    {
      // See [gatsby-plugin-feed doc](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/) .
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                # All fields are pass through as \`feedOptions\` .
                title # This is overwritten by \`title\` of \`feeds\` .
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownPost } }) =>
              allMarkdownPost.nodes.map(
                ({ date, rssContentEncoded, rssDescription, slug, title }) => ({
                  date,
                  title,
                  description: rssDescription,
                  url: new URL(slug, site.siteMetadata.siteUrl).href, // Unlike Gatsby, URL must be percent-encoded in RSS.
                  custom_elements: [{ "content:encoded": rssContentEncoded }],
                })
              ),
            query: `
              {
                allMarkdownPost(limit: 20, sort: {date: DESC}) {
                  nodes {
                    date
                    rssContentEncoded
                    rssDescription
                    slug
                    title
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Your site's RSS feed | All",
          },
          {
            serialize: ({ query: { site, allMarkdownPost } }) =>
              allMarkdownPost.nodes.map(
                ({ date, rssContentEncoded, rssDescription, slug, title }) => ({
                  date,
                  title,
                  description: rssDescription,
                  url: new URL(slug, site.siteMetadata.siteUrl).href, // Unlike Gatsby, URL must be percent-encoded in RSS.
                  custom_elements: [{ "content:encoded": rssContentEncoded }],
                })
              ),
            query: `
              {
                allMarkdownPost(filter: {tags: {elemMatch: {slug: {eq: "フィギュア"}}}}, limit: 20, sort: {date: DESC}) {
                  nodes {
                    date
                    rssContentEncoded
                    rssDescription
                    slug
                    title
                  }
                }
              }
            `,
            output: "/tags/フィギュア/rss.xml",
            title: "Your site's RSS feed | tag: フィギュア",
          },
        ],
      },
    },
    "gatsby-plugin-postcss",
    {
      resolve: `@tenpamk2/gatsby-theme-figure-blog`,
      options: {
        basePath: ``,
        descriptionPrunedLength: 128,
        descriptionTruncate: true,
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
        optionsGatsbyPluginImage: {},
        optionsGatsbyPluginSharp: {},
        optionsGatsbyRemarkImages: {
          quality: 90,
        },
        optionsGatsbyRemarkPrismjs: {},
        optionsGatsbySourceFilesystemForPages: {},
        optionsGatsbySourceFilesystemForPosts: {},
        optionsGatsbyTransformerRemark: {
          excerpt_separator: `<!-- more -->`, // If `undefined` is specified, default pruning method is used.
        },
        optionsGatsbyTransformerSharp: {},
        pagesPath: `pages`,
        postPath: ``,
        rssNeedFullContent: false, // Set `true` if you want to privide full content via RSS.
        rssPruneLength: 256, // I don't provide full content via RSS because I want viewers to visit my site!!
        rssTruncate: true,
      },
    },
  ],
};
