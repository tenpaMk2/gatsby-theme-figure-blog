export default (themeOptions) => ({
  plugins: [
    {
      resolve: `gatsby-plugin-image`,
      options: { ...{}, ...themeOptions.optionsGatsbyPluginImage },
    },
    {
      resolve: `gatsby-plugin-sharp`,
      options: { ...{}, ...themeOptions.optionsGatsbyPluginSharp },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        ...{
          name: `blog`,
          path: `content/posts`,
        },
        ...themeOptions.optionsGatsbySourceFilesystemForPosts,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        ...{
          name: `pages`,
          path: `content/pages`,
        },
        ...themeOptions.optionsGatsbySourceFilesystemForPages,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        ...{
          plugins: [
            {
              resolve: `gatsby-remark-images`,
              options: {
                ...{
                  maxWidth: 1024, // DON'T ERASE IT!! This value is used as base breakpoints. See [doc](https://www.gatsbyjs.com/plugins/gatsby-remark-images/) .
                  linkImagesToOriginal: true,
                  withWebp: true,
                  withAvif: true,
                  quality: 90,
                  wrapperStyle: (image) =>
                    `max-width:${(image.aspectRatio * 100).toFixed(2)}vh`, // See [issue: Can't specify max-width](https://github.com/gatsbyjs/gatsby/issues/15578) .
                  backgroundColor: "transparent",
                },
                ...themeOptions.optionsGatsbyRemarkImages,
              },
            },
            {
              resolve: `gatsby-remark-prismjs`,
              options: {
                ...{},
                ...themeOptions.optionsGatsbyRemarkPrismjs,
              },
            },
            `gatsby-remark-responsive-iframe`,
            {
              resolve: `gatsby-remark-autolink-headers`,
              options: {
                isIconAfterHeader: true,
              },
            },
          ],
        },
        ...themeOptions.optionsGatsbyTransformerRemark,
      },
    },
    {
      resolve: `gatsby-transformer-sharp`,
      options: { ...{}, ...themeOptions.optionsGatsbyTransformerSharp },
    },
    `gatsby-plugin-twitter`,
  ],
});
