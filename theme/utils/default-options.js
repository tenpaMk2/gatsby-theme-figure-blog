/**
 * Get options from theme options.
 * If the property of theme options is `undefined` , set the default value.
 *
 * @param  {Object} themeOptions - theme options.
 * @returns {Object} Options that is determined by user options and default options.
 */
const getOptions = (themeOptions) => {
  const archivesPath = themeOptions.archivesPath || `archives`;
  const basePath =
    themeOptions.basePath || themeOptions.basePath === `` ? `` : `base`;
  const cardsPerPage = themeOptions.cardsPerPage || 12;
  const debugPath = themeOptions.debugPath || `debug`;
  const formatString = themeOptions.formatString || `YYYY/MM/DD HH:mm:ss`;
  const locale = themeOptions.locale || `en-US`;
  const pagesPath =
    themeOptions.pagesPath || themeOptions.pagesPath === `` ? `` : `pages`;
  const postPath =
    themeOptions.postPath || themeOptions.postPath === `` ? `` : `post`;
  const postsPerPage = themeOptions.postsPerPage || 6;
  const tagsPath = themeOptions.tagsPath || `tags`;

  // Check the debug page for any forgotten definitions.
  return {
    archivesPath,
    basePath,
    cardsPerPage,
    debugPath,
    formatString,
    locale,
    pagesPath,
    postPath,
    postsPerPage,
    tagsPath,
  };
};

module.exports = {
  getOptions,
};
