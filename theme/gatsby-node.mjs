import { createRequire } from "module";
import { parse } from "path";
import { kebabCase } from "./src/libs/kebab-case.mjs";
import { slugify } from "./src/libs/slugify.mjs";
import { getOptions } from "./utils/default-options.mjs";
import { removeUndefined } from "./src/libs/removeUndefined.mjs";

export { createSchemaCustomization } from "./create-schema-customization.mjs";

const require = createRequire(import.meta.url);

/**
 * Max date in ISO format for posts.
 * The reason why the value of milliseconds is `998` is
 * `9999-12-31T23:59:59.999Z` is the max value and used by `lt` filter in GraphQL.
 */
const maxPostDateISO = new Date(`9999-12-31T23:59:59.998Z`).toISOString();

const maxGraphQLDateISO = new Date(`9999-12-31T23:59:59.999Z`).toISOString();

/**
 * @type {import('gatsby').GatsbyNode['sourceNodes']}
 */
export const sourceNodes = (
  {
    actions,
    createContentDigest,
    createNodeId,
    getNode,
    getNodesByType,
    reporter,
  },
  themeOptions
) => {
  const { createNode } = actions;

  /**
   * Create a theme options node.
   */
  const options = getOptions(themeOptions);
  createNode({
    ...options,
    id: `@tenpamk2/gatsby-theme-figure-blog-config`,
    parent: null,
    children: [],
    internal: {
      type: `FigureBlogConfig`,
      contentDigest: createContentDigest(options),
      content: JSON.stringify(options),
      description: `Options for @tenpamk2/gatsby-theme-figure-blog`,
    },
  });

  /**
   * Create tag info nodes.
   */
  const posts = getNodesByType(`MarkdownPost`);
  const postsTags = posts.map(({ tags }) => tags);
  const allTags = postsTags?.flat().filter((tag) => tag);
  const allTagNames = allTags.map(({ name }) => name);
  const tagInfos = [...new Set(allTagNames)].map((name) => {
    const filtered = allTags.filter(({ name: n }) => n === name);
    const count = filtered.length;
    const slug = filtered[0].slug;

    return { name, count, slug };
  });

  const countToRank = [];
  [...new Set(tagInfos.map(({ count }) => count))]
    .sort()
    .forEach((count, idx) => {
      countToRank[count] = idx;
    });

  for (const info of tagInfos) {
    info.rank = countToRank[info.count];

    createNode({
      ...info,
      id: createNodeId(`Tag info: ${info.name}`),
      parent: null,
      children: [],
      internal: {
        type: `TagInfo`,
        contentDigest: createContentDigest(info), // Update the digest when the posts are changed.
        description: `TagInfo for @tenpamk2/gatsby-theme-figure-blog`,
      },
    });
  }

  /**
   * Create year month info nodes.
   */
  const allDateInfos = posts.map(({ date }) => {
    const d = new Date(date);
    const yearNumber = d.getFullYear();
    const monthNumber = d.getMonth();

    const yearPadded = yearNumber.toString().padStart(5, `0`);
    const monthPadded = monthNumber.toString().padStart(2, `0`);
    const keyForSort = `${yearPadded}-${monthPadded}`;

    return { yearNumber, monthNumber, keyForSort };
  });

  for (const [, info] of new Map(
    allDateInfos.map((info) => [info.keyForSort, info])
  )) {
    info.count = allDateInfos.filter(
      ({ keyForSort: k }) => k === info.keyForSort
    ).length;

    createNode({
      ...info,
      id: createNodeId(`Year month info: ${info.keyForSort}`),
      parent: null,
      children: [],
      internal: {
        type: `YearMonthInfo`,
        contentDigest: createContentDigest(info), // Update the digest when the posts are changed.
        description: `YearMonthInfo for @tenpamk2/gatsby-theme-figure-blog`,
      },
    });
  }

  /**
   * Create year month info nodes.
   */
  for (const yearNumber of new Set(
    allDateInfos.map(({ yearNumber }) => yearNumber)
  )) {
    const info = {
      yearNumber,
      count: allDateInfos.filter(({ yearNumber: y }) => y === yearNumber)
        .length,
    };

    createNode({
      ...info,
      id: createNodeId(`Year info: ${info.yearNumber}`),
      parent: null,
      children: [],
      internal: {
        type: `YearInfo`,
        contentDigest: createContentDigest(info), // Update the digest when the posts are changed.
        description: `YearInfo for @tenpamk2/gatsby-theme-figure-blog`,
      },
    });
  }

  /**
   * Check for duplicate `excerpt_separator` .
   */
  const sitePlugins = getNodesByType(`SitePlugin`);
  const {
    pluginOptions: { excerpt_separator },
  } = sitePlugins.filter(({ name }) => name === `gatsby-transformer-remark`)[0];

  const markdownRemarks = getNodesByType(`MarkdownRemark`);
  for (const { fileAbsolutePath, rawMarkdownBody } of markdownRemarks) {
    if (3 <= rawMarkdownBody.split(excerpt_separator).length) {
      reporter.warn(
        `"${fileAbsolutePath}" has duplicate "${excerpt_separator}"`
      );
    }
  }

  /**
   * Check for hero image.
   */
  const pages = getNodesByType(`MarkdownPage`);
  for (const { heroImage, heroImageAlt, parent } of [...posts, ...pages]) {
    const { fileAbsolutePath } = getNode(parent);

    if (heroImage && heroImageAlt) continue;
    if (!heroImage && !heroImageAlt) continue;

    reporter.warn(
      `"${fileAbsolutePath}" has only one of \`heroImage\` and \`heroImageAlt\` .`
    );
  }

  /**
   * Check for unknown frontmatter.
   */
  for (const { frontmatter, fileAbsolutePath } of markdownRemarks) {
    for (const key of Object.keys(frontmatter)) {
      if (
        [
          `slug`,
          `title`,
          `canonicalUrl`,
          `heroImage`,
          `heroImageAlt`,
          `tags`,
          `date`,
        ].includes(key)
      )
        continue;

      reporter.warn(
        `"${fileAbsolutePath}" has unknown frontmatter \`${key}\` .`
      );
    }
  }

  /**
   * Check for date.
   */
  for (const { date, title } of posts) {
    if (/\+\d/.test(date) || /Z$/.test(date)) continue;

    reporter.warn(
      [
        `"${title}"'s date must specify time zone (e.g. "+9") or be in ISO 8601 format`,
        `Otherwise, Gatsby will treat the date as UTC, not local time.`,
      ].join(` `)
    );
  }
};

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
export const createPages = async (
  { graphql, actions, reporter },
  themeOptions
) => {
  const { createPage } = actions;

  const {
    archivesPath,
    basePath,
    cardsPerPage,
    debugPath,
    intlYear,
    intlYearAndMonth,
    locale,
    pagesPath,
    postsPerPage,
    tagsPath,
  } = getOptions(themeOptions);

  const result = await graphql(`
    {
      allMarkdownPage {
        nodes {
          id
          slug
        }
      }
      allMarkdownPost(sort: { date: ASC }) {
        edges {
          node {
            id
            tags {
              name
              slug
            }
            slug
          }
          next {
            id
          }
          previous {
            id
          }
        }
      }
      allTagInfo {
        nodes {
          count
          name
          slug
        }
      }  
      allYearInfo {
        nodes {
          count
          yearNumber
        }
      }  
      allYearMonthInfo {
        nodes {
          count
          monthNumber
          yearNumber
        }
      }  
      pageInfoPassthrough: allMarkdownPost(limit: ${postsPerPage}) {
        pageInfo {
          pageCount
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    );
    return;
  }

  const edges = result.data.allMarkdownPost.edges;

  /**
   * Create each post page.
   */
  for (const { node, next, previous } of edges) {
    createPage({
      path: node.slug, // `node.slug` may not start with `basePath` and `postPath` .
      component: require.resolve(`./src/templates/markdown-post.js`),
      context: {
        id: node.id,
        nextPostId: next?.id ?? ``, // Workaround for a bug that allows post to query when `id` is undefined.
        previousPostId: previous?.id ?? ``, // Workaround for a bug that allows post to query when `id` is undefined.
      },
    });
  }

  /**
   * Create main pages.
   */
  const pagesTotal = result.data.pageInfoPassthrough.pageInfo.pageCount;
  for (let i = 0; i < pagesTotal; i++) {
    createPage({
      path: i === 0 ? slugify(basePath) : slugify(basePath, pagesPath, i + 1),
      component: require.resolve("./src/templates/markdown-posts.js"),
      context: {
        limit: postsPerPage,
        pagesStartPath: basePath,
        skip: i * postsPerPage,
      },
    });
  }

  /**
   * Create tag pages.
   */
  const tagInfos = result.data.allTagInfo.nodes || [];
  for (const { name, slug, count } of tagInfos) {
    const pagesStartPath = slugify(basePath, tagsPath, slug);

    const pagesTotal = Math.ceil(count / cardsPerPage);
    for (let i = 0; i < pagesTotal; i++) {
      createPage({
        path:
          i === 0
            ? pagesStartPath
            : pagesStartPath.slice(0, -1) + slugify(pagesPath, i + 1),
        component: require.resolve(`./src/templates/tag.js`),
        context: {
          limit: cardsPerPage,
          pagesStartPath,
          pageTitle: name,
          skip: i * cardsPerPage,
          slug,
        },
      });
    }
  }

  /**
   * Create root archive pages.
   */
  const archivesPagesTotal = Math.ceil(
    result.data.allMarkdownPost.edges.length / cardsPerPage
  );
  const archivesPagesStartPath = slugify(basePath, archivesPath);

  for (let i = 0; i < archivesPagesTotal; i++) {
    createPage({
      path:
        i === 0
          ? archivesPagesStartPath
          : archivesPagesStartPath.slice(0, -1) + slugify(pagesPath, i + 1),
      component: require.resolve(`./src/templates/archive.js`),
      context: {
        dateGreaterThanEqual: new Date(0, 0).toISOString(),
        dateLessThan: maxGraphQLDateISO,
        limit: cardsPerPage,
        pagesStartPath: archivesPagesStartPath,
        pageTitle: `Archives`,
        skip: i * cardsPerPage,
      },
    });
  }

  /**
   * Create year archive pages.
   */
  const yearInfos = result.data.allYearInfo.nodes || [];

  for (const { count, yearNumber } of yearInfos) {
    const yearPadded = yearNumber.toString().padStart(4, `0`);
    const pagesStartPath = slugify(basePath, archivesPath, yearPadded);

    const pagesTotal = Math.ceil(count / cardsPerPage);
    for (let i = 0; i < pagesTotal; i++) {
      const dateGreaterThanEqual = new Date(yearNumber, 0).toISOString();

      const upperDate = new Date(yearNumber + 1, 0);
      const dateLessThan =
        new Date(maxPostDateISO) < upperDate
          ? maxGraphQLDateISO
          : upperDate.toISOString();

      createPage({
        path:
          i === 0
            ? pagesStartPath
            : pagesStartPath.slice(0, -1) + slugify(pagesPath, i + 1),
        component: require.resolve(`./src/templates/archive.js`),
        context: {
          dateGreaterThanEqual,
          dateLessThan,
          limit: cardsPerPage,
          pagesStartPath,
          pageTitle: new Intl.DateTimeFormat(locale, intlYear).format(
            new Date(yearNumber, 0)
          ),
          skip: i * cardsPerPage,
        },
      });
    }
  }

  /**
   * Create month-and-year archive pages.
   */
  const yearMonthInfos = result.data.allYearMonthInfo.nodes || [];

  for (const { count, monthNumber, yearNumber } of yearMonthInfos) {
    const yearPadded = yearNumber.toString().padStart(4, `0`);
    const monthPadded = (monthNumber + 1).toString().padStart(2, `0`);

    const pagesStartPath = slugify(
      basePath,
      archivesPath,
      yearPadded,
      monthPadded
    );

    const pagesTotal = Math.ceil(count / cardsPerPage);
    for (let i = 0; i < pagesTotal; i++) {
      const dateGreaterThanEqual = new Date(
        yearNumber,
        monthNumber
      ).toISOString();

      const upperDate = new Date(yearNumber, monthNumber + 1);
      const dateLessThan =
        new Date(maxPostDateISO) < upperDate
          ? maxGraphQLDateISO
          : upperDate.toISOString();

      createPage({
        path:
          i === 0
            ? pagesStartPath
            : pagesStartPath.slice(0, -1) + slugify(pagesPath, i + 1),
        component: require.resolve(`./src/templates/archive.js`),
        context: {
          dateGreaterThanEqual,
          dateLessThan,
          limit: cardsPerPage,
          pagesStartPath,
          pageTitle: new Intl.DateTimeFormat(locale, intlYearAndMonth).format(
            new Date(yearNumber, monthNumber)
          ),
          skip: i * cardsPerPage,
        },
      });
    }
  }

  /**
   * Create each static markdown page.
   */
  for (const { slug, id } of result.data.allMarkdownPage.nodes) {
    createPage({
      path: slug,
      component: require.resolve(`./src/templates/markdown-page.js`),
      context: {
        id,
      },
    });
  }

  /**
   * Create a debug page.
   */
  if (process.env.NODE_ENV !== `production`) {
    createPage({
      path: slugify(basePath, debugPath),
      component: require.resolve(`./src/templates/debug.js`),
    });
  }
};

/**
 * Decide slug.
 * @param {string} relativePath
 * @param {Object} options
 * @param {string[]} options.basePaths
 * @param {string} options.slug
 * @returns {string}
 */
const decideSlug = (relativePath = ``, { basePaths = [], slug = `` }) => {
  const { dir, name } = parse(relativePath);
  return (
    slug ||
    (name === `index`
      ? slugify(...basePaths, ...dir.split(`/`))
      : slugify(...basePaths, ...dir.split(`/`), name))
  );
};

/**
 * Decide title.
 * @param {string} relativePath
 * @param {string} title
 * @returns {string}
 */
const decideTitle = (relativePath, title) => {
  const { name } = parse(relativePath);
  return title || name;
};

/**
 * Create a Markdown page node.
 *
 * @param {import('gatsby').CreateNodeArgs<Record<string, unknown>>} args
 * @param {import('gatsby').PluginOptions} themeOptions
 * @returns {void}
 */
const createMarkdownPageNode = (
  { actions, createContentDigest, createNodeId, getNode, node },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;

  const { basePath } = getOptions(themeOptions);
  const { relativePath } = getNode(node.parent);

  const slug = decideSlug(relativePath, {
    basePaths: [basePath],
    slug: node.frontmatter?.slug,
  });

  const title = decideTitle(relativePath, node.frontmatter.title);

  const overwrite = {
    canonicalUrl: node.frontmatter.canonicalUrl,
    heroImage: node.frontmatter.heroImage,
    heroImageAlt: node.frontmatter.heroImageAlt,
  };

  const fieldData = {
    ...{
      canonicalUrl: ``,
      heroImage: ``,
      heroImageAlt: ``,
      slug,
      title,
    },
    ...overwrite,
  };

  const id = createNodeId(`${node.id} >>> MarkdownPage`);

  createNode({
    ...fieldData,
    // Required fields
    id,
    parent: node.id,
    children: [],
    internal: {
      type: `MarkdownPage`,
      contentDigest: createContentDigest(fieldData),
      content: JSON.stringify(fieldData),
      description: `MarkdownPage`,
    },
  });

  createParentChildLink({ parent: node, child: getNode(id) });
};

/**
 * Create a Markdown post node.
 *
 * @param {import('gatsby').CreateNodeArgs<Record<string, unknown>>} args
 * @param {import('gatsby').PluginOptions} themeOptions
 * @returns {void}
 */
const createMarkdownPostNode = (
  { actions, createContentDigest, createNodeId, getNode, node },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;

  const { basePath, postPath } = getOptions(themeOptions);

  const { relativePath } = getNode(node.parent);

  const slug = decideSlug(relativePath, {
    basePaths: [basePath, postPath],
    slug: node.frontmatter?.slug,
  });

  const title = decideTitle(relativePath, node.frontmatter.title);

  const overwrite = {
    canonicalUrl: node.frontmatter.canonicalUrl,
    date: node.frontmatter.date,
    heroImage: node.frontmatter.heroImage,
    heroImageAlt: node.frontmatter.heroImageAlt,
    tags: node.frontmatter.tags?.map((tag) => ({
      name: tag,
      slug: kebabCase(tag),
    })),
  };

  const fieldData = {
    ...{
      canonicalUrl: ``,
      date: maxPostDateISO,
      heroImage: ``,
      heroImageAlt: ``,
      slug,
      tags: [],
      title,
    },
    ...removeUndefined(overwrite),
  };

  const id = createNodeId(`${node.id} >>> MarkdownPost`);

  createNode({
    ...fieldData,
    // Required fields
    id,
    parent: node.id,
    children: [],
    internal: {
      type: `MarkdownPost`,
      contentDigest: createContentDigest(fieldData),
      content: JSON.stringify(fieldData),
      description: `MarkdownPost`,
    },
  });

  createParentChildLink({ parent: node, child: getNode(id) });
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
export const onCreateNode = (args, themeOptions) => {
  const { getNode, node, reporter } = args;

  if (node.internal.type !== `MarkdownRemark`) return;

  const { sourceInstanceName } = getNode(node.parent);

  switch (sourceInstanceName) {
    case `pages`:
      createMarkdownPageNode(args, themeOptions);
      break;
    case `blog`:
      createMarkdownPostNode(args, themeOptions);
      break;
    default:
      reporter.info(
        [
          `There are names of \`gatsby-source-filesystem\` that \`gatsby-theme-figure-blog\` does not know.`,
          `If you do not expect this, check \`gatsby-source-filesystem\` configs.`,
        ].join(` `)
      );
      return;
  }
};
