import { useStaticQuery, graphql } from "gatsby";

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
          cardsPerPage
          debugPath
          externalLinks {
            name
            url
          }
          intlYear
          intlMonthAndDate
          intlTime
          locale
          pagesPath
          playgroundPath
          postPath
          postsPerPage
          rssNeedFullContent
          rssPruneLength
          rssTruncate
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
