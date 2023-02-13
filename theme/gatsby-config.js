module.exports = {
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `content/posts`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- more -->`,
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1024, // sync the value of `max-w-screen-lg` by Tailwind CSS.
              linkImagesToOriginal: true,
              withWebp: true,
              withAvif: true,
              quality: 90,
              wrapperStyle: (image) =>
                `max-width:${(image.aspectRatio * 100).toFixed(2)}vh`, // See [issue: Can't specify max-width](https://github.com/gatsbyjs/gatsby/issues/15578) .
              backgroundColor: "transparent",
            },
          },
          `gatsby-remark-prismjs`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
  ],
};
