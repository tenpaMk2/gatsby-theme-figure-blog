import { createRequire } from "module";
import { parse } from "path";
import { kebabCase } from "./src/libs/kebab-case.mjs";
import { slugify } from "./src/libs/slugify.mjs";
import { getOptions } from "./utils/default-options.mjs";

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
  { actions, createContentDigest, getNodesByType, reporter },
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
   * Create a posts info node.
   */
  const posts = getNodesByType(`MarkdownPost`);
  // Create an empty node. The remaining fields are defined by the type and their values are generated by the resolver.
  createNode({
    id: `@tenpamk2/gatsby-theme-figure-blog-posts-info`,
    parent: null,
    children: [],
    internal: {
      type: `PostsInfo`,
      contentDigest: createContentDigest(posts), // update the digest when the posts are changed.
      description: `PostsInfo for @tenpamk2/gatsby-theme-figure-blog`,
    },
  });

  /**
   * Check for duplicate `excerpt_separator` .
   */
  const sitePlugins = getNodesByType(`SitePlugin`);
  const {
    pluginOptions: { excerpt_separator },
  } = sitePlugins.filter(({ name }) => name === `gatsby-transformer-remark`)[0];

  const markdownRemarks = getNodesByType(`MarkdownRemark`);
  markdownRemarks.forEach(({ fileAbsolutePath, rawMarkdownBody }) => {
    if (3 <= rawMarkdownBody.split(excerpt_separator).length) {
      reporter.warn(
        `"${fileAbsolutePath}" has duplicate "${excerpt_separator}"`
      );
    }
  });
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
      pageInfoPassthrough: allMarkdownPost(limit: ${postsPerPage}) {
        pageInfo {
          pageCount
        }
      }
      postsInfo {
        tagInfos {
          count
          name
          slug
        }
        yearInfos {
          count
          yearNumber
        }        
        yearMonthInfos {
          count
          monthNumber
          yearNumber
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
  edges.forEach(({ node, next, previous }) => {
    createPage({
      path: node.slug, // `node.slug` may not start with `basePath` and `postPath` .
      component: require.resolve(`./src/templates/markdown-post.js`),
      context: {
        id: node.id,
        nextPostId: next?.id,
        previousPostId: previous?.id,
      },
    });
  });

  /**
   * Create main pages.
   */
  const pagesTotal = result.data.pageInfoPassthrough.pageInfo.pageCount;

  [...new Array(pagesTotal)].forEach((_, i) => {
    createPage({
      path: i === 0 ? slugify(basePath) : slugify(basePath, pagesPath, i + 1),
      component: require.resolve("./src/templates/markdown-posts.js"),
      context: {
        limit: postsPerPage,
        pagesStartPath: basePath,
        skip: i * postsPerPage,
      },
    });
  });

  /**
   * Create tag pages.
   */
  const tagInfos = result.data.postsInfo.tagInfos || [];
  tagInfos.forEach(({ name, slug, count }) => {
    const pagesStartPath = slugify(basePath, tagsPath, slug);

    const pagesTotal = Math.ceil(count / cardsPerPage);
    [...new Array(pagesTotal)].forEach((_, i) => {
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
    });
  });

  /**
   * Create root archive pages.
   */
  const archivesPagesTotal = Math.ceil(
    result.data.allMarkdownPost.edges.length / cardsPerPage
  );
  const archivesPagesStartPath = slugify(basePath, archivesPath);

  [...new Array(archivesPagesTotal)].forEach((_, i) => {
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
  });

  /**
   * Create year archive pages.
   */
  const yearInfos = result.data.postsInfo.yearInfos || [];

  yearInfos.forEach(({ count, yearNumber }) => {
    const yearPadded = yearNumber.toString().padStart(4, `0`);
    const pagesStartPath = slugify(basePath, archivesPath, yearPadded);

    const pagesTotal = Math.ceil(count / cardsPerPage);
    [...new Array(pagesTotal)].forEach((_, i) => {
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
    });
  });

  /**
   * Create month-and-year archive pages.
   */
  const yearMonthInfos = result.data.postsInfo.yearMonthInfos || [];

  yearMonthInfos.forEach(({ count, monthNumber, yearNumber }) => {
    const yearPadded = yearNumber.toString().padStart(4, `0`);
    const monthPadded = (monthNumber + 1).toString().padStart(2, `0`);

    const pagesStartPath = slugify(
      basePath,
      archivesPath,
      yearPadded,
      monthPadded
    );

    const pagesTotal = Math.ceil(count / cardsPerPage);
    [...new Array(pagesTotal)].forEach((_, i) => {
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
    });
  });

  /**
   * Create each static markdown page.
   */
  result.data.allMarkdownPage.nodes.forEach((node) =>
    createPage({
      path: node.slug,
      component: require.resolve(`./src/templates/markdown-page.js`),
      context: {
        id: node.id,
      },
    })
  );

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
const decideSlug = (relativePath, { basePaths = [], slug = `` }) => {
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

  const title = decideTitle(relativePath, node.frontmatter?.title);

  const fieldData = {
    canonicalUrl: node.frontmatter?.canonicalUrl || ``,
    heroImage: node.frontmatter?.heroImage,
    slug,
    title,
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

  const title = decideTitle(relativePath, node.frontmatter?.title);

  const modifiedTags =
    node.frontmatter.tags?.map((tag) => ({
      name: tag,
      slug: kebabCase(tag),
    })) || [];

  const fieldData = {
    canonicalUrl: node.frontmatter?.canonicalUrl || ``,
    date: node.frontmatter?.date || maxPostDateISO,
    heroImage: node.frontmatter?.heroImage,
    slug,
    tags: modifiedTags,
    title,
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
