/**
 * Get options from theme options.
 * If the property of theme options is `undefined` , set the default value.
 *
 * @param  {Object} themeOptions - theme options.
 * @returns {Object} Options that is determined by user options and default options.
 */
const getOptions = (themeOptions) => {
  const basePath = themeOptions.basePath || `base`;
  const postPath = themeOptions.postPath || `post`;
  const pagesPath = themeOptions.pagesPath || `pages`;
  const tagsPath = themeOptions.tagsPath || `tags`;
  const archivesPath = themeOptions.archivesPath || `archives`;
  const formatString = themeOptions.formatString || `YYYY/MM/DD HH:mm:ss`;

  // WARNING: If you change these properties, you must also change GraphQL type definitions.
  return {
    basePath,
    postPath,
    pagesPath,
    tagsPath,
    archivesPath,
    formatString,
  };
};

module.exports = {
  getOptions,
};
