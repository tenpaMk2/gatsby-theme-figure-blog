/**
 * Get options from theme options.
 * If the property of theme options is `undefined` , set the default value.
 *
 * @param  {Object} themeOptions - theme options.
 * @returns {Object} Options that is determined by user options and default options.
 */
const getOptions = (themeOptions) => {
  const archivesPath = themeOptions.archivesPath || `archives`;
  const basePath = themeOptions.basePath || `base`;
  const formatString = themeOptions.formatString || `YYYY/MM/DD HH:mm:ss`;
  const locale = themeOptions.locale || `en-US`;
  const postPath = themeOptions.postPath || `post`;
  const pagesPath = themeOptions.pagesPath || `pages`;
  const tagsPath = themeOptions.tagsPath || `tags`;

  // WARNING: If you change these properties, you must also change GraphQL type definitions and `src/libs/query-blog-config.js`.
  return {
    archivesPath,
    basePath,
    formatString,
    locale,
    postPath,
    pagesPath,
    tagsPath,
  };
};

module.exports = {
  getOptions,
};
