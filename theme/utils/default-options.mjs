/**
 * Get (decide) options from inputted theme options.
 * If the property of theme options is a `undefined` , set the default value.
 * Some options can not be empty string.
 *
 * `options***` of theme options are ignored.
 * (If you want to use it, query `SitePlugin.pluginOptions` from GraphQL.)
 *
 * If you change some options by shodowing, you should also update the debug page.
 *
 * @param  {Object} themeOptions - Theme options.
 * @returns {Object} Options.
 */
export const getOptions = (themeOptions) => ({
  archivesPath: themeOptions.archivesPath || `archives`,
  basePath: themeOptions.basePath ?? `base`,
  cardsPerPage: themeOptions.cardsPerPage || 12,
  debugPath: themeOptions.debugPath || `debug`,
  externalLinks: themeOptions.externalLinks || [],
  formatStringMonthAndDay: themeOptions.formatStringMonthAndDay || `MM/DD`,
  formatStringTime: themeOptions.formatStringTime ?? `HH:mm:ss`,
  formatStringYear: themeOptions.formatStringYear ?? `YYYY`,
  locale: themeOptions.locale || `en-US`,
  pagesPath: themeOptions.pagesPath ?? `pages`,
  playgroundPath: themeOptions.playgroundPath || `playground`,
  postPath: themeOptions.postPath ?? `post`,
  postsPerPage: themeOptions.postsPerPage || 6,
  rssNeedFullContent: themeOptions.rssNeedFullContent === true,
  rssPruneLength: themeOptions.rssPruneLength ?? 128,
  rssTruncate: themeOptions.rssTruncate === true,
  tagsPath: themeOptions.tagsPath || `tags`,
});
