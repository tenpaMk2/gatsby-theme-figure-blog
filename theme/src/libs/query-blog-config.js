const { useStaticQuery, graphql } = require("gatsby");

/**
 * This querys the blog config .
 *
 * @returns {Object} configs.
 */
export const queryBlogConfig = () => {
  const { figureBlogConfig } = useStaticQuery(
    graphql`
      query {
        figureBlogConfig {
          archivesPath
          basePath
          formatString
          locale
          pagesPath
          postPath
          tagsPath
        }
      }
    `
  );

  console.assert(
    figureBlogConfig,
    `No \`figureBlogConfig\` node was found. Check the \`createNode()\` .`
  );

  return figureBlogConfig;
};
