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
  ...{
    archivesPath: `archives`,
    basePath: `base`,
    cardsPerPage: 12,
    debugPath: `debug`,
    externalLinks: [],
    intlYear: { year: `numeric` },
    intlYearAndMonth: { year: `numeric`, month: `short` },
    intlMonth: { month: `short` },
    intlMonthAndDate: {
      month: `short`,
      day: `numeric`,
    },
    intlTime: {
      timeStyle: `short`,
      hour12: false,
    },
    locale: `en-US`,
    pagesPath: `pages`,
    playgroundPath: `playground`,
    postPath: `post`,
    postsPerPage: 6,
    rssNeedFullContent: false,
    rssPruneLength: 128,
    rssTruncate: false,
    tagsPath: `tags`,
  },
  ...themeOptions,
});
