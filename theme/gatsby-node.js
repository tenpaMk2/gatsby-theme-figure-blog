const { kebabCase } = require("./src/libs/kebab-case");
const { slugify } = require("./src/libs/slugify");
const { getOptions } = require("./utils/default-options");
const { parse, sep } = require("path");
const {
  excerptASTToDescription,
  excerptASTToContentEncoded,
} = require("./utils/rss");

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }, themeOptions) => {
  const { createFieldExtension, createTypes } = actions;
  const { locale, rssNeedFullContent, rssPruneLength, rssTruncate } =
    getOptions(themeOptions);

  const typeDefs = `
    type MarkdownPost implements Node {
      canonicalUrl: String
      date: Date! @dateformat
      excerpt: String! @excerpt
      # About \`@fileByRelativePath\` , see [Gatsby issue](https://github.com/gatsbyjs/gatsby/issues/18271) .
      heroImage: File @fileByRelativePath
      html: String! @html
      needReadMore: Boolean! @needReadMore
      rssDescription: String! @rssDescription
      rssContentEncoded: String! @rssContentEncoded
      slug: String!
      tags: [PostTag]
      title: String!
    }

    type MarkdownPage implements Node {
      canonicalUrl: String
      heroImage: File @fileByRelativePath
      html: String! @html
      slug: String!
      title: String!
    }

    type PostTag {
      name: String
      slug: String
    }

    # Check the debug page for any forgotten definitions.
    type FigureBlogConfig implements Node {
      archivesPath: String
      basePath: String
      cardsPerPage: Int
      debugPath: String
      externalLinks: [ExternalLink]!
      formatStringMonthAndDay: String
      formatStringTime: String
      formatStringYear: String
      locale: String
      pagesPath: String
      playgroundPath: String
      postPath: String
      postsPerPage: Int
      rssNeedFullContent: Boolean
      rssPruneLength: Int
      rssTruncate: Boolean
      tagsPath: String
    }

    type ExternalLink {
      name: String!
      url: String!
    }

    type PostsInfo implements Node {
      tagInfos: [TagInfo!]! @tagInfos
      yearInfos: [YearInfo!]! @yearInfos
      yearMonthInfos: [YearMonthInfo!]! @yearMonthInfos(locale: "${locale}")
    }

    type TagInfo {
      count: Int!
      name: String!
      slug: String!
    }
    
    type YearInfo {
      count: Int!
      yearNumber: Int!
      yearString: String!
    }

    type YearMonthInfo {
      count: Int!
      monthNumber: Int!
      monthString: String!
      yearNumber: Int!
      yearString: String!
    }
  `;
  createTypes(typeDefs);

  createFieldExtension({
    name: `excerpt`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          if (Object.keys(args).length !== 0) {
            throw new Error(`Don't use args!!`);
          }

          const markdownRemarkNode = context.nodeModel.getNodeById({
            id: source.parent,
          });

          const type = info.schema.getType(`MarkdownRemark`);
          const resolver = type.getFields()[`excerpt`].resolve;

          const result = await resolver(
            markdownRemarkNode,
            // The following args must be fixed becase excerpt is used later to determine if it represents the entire HTML.
            {
              pruneLength: 2147483647, // Max value of 32bit signed integer.
              truncate: true, // Truncate the text even in the middle of a world. It is needed for CJK texts.
              format: "HTML",
            },
            context,
            info
          );
          return result;
        },
      };
    },
  });

  createFieldExtension({
    name: `rssDescription`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const markdownRemarkNode = context.nodeModel.getNodeById({
            id: source.parent,
          });

          const type = info.schema.getType(`MarkdownRemark`);
          const resolver = type.getFields()[`excerptAst`].resolve;

          const ast = await resolver(
            markdownRemarkNode,
            {
              ...{
                pruneLength: 512, // TODO: Use options.
                truncate: true,
              },
              ...args,
            },
            context,
            info
          );
          return excerptASTToDescription(ast);
        },
      };
    },
  });

  createFieldExtension({
    name: `rssContentEncoded`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const markdownRemarkNode = context.nodeModel.getNodeById({
            id: source.parent,
          });

          const type = info.schema.getType(`MarkdownRemark`);
          const resolver = rssNeedFullContent
            ? type.getFields()[`htmlAst`].resolve
            : type.getFields()[`excerptAst`].resolve;

          const {
            siteMetadata: { siteUrl },
          } = await context.nodeModel.findOne({
            type: `Site`,
          });

          const ast = await resolver(
            markdownRemarkNode,
            rssNeedFullContent
              ? {}
              : {
                  ...{
                    pruneLength: rssPruneLength,
                    truncate: rssTruncate,
                  },
                  ...args,
                },
            context,
            info
          );
          return excerptASTToContentEncoded(ast, siteUrl);
        },
      };
    },
  });

  createFieldExtension({
    name: `html`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          if (Object.keys(args).length !== 0) {
            throw new Error(`Don't use args!!`);
          }

          const markdownRemarkNode = context.nodeModel.getNodeById({
            id: source.parent,
          });

          const type = info.schema.getType(`MarkdownRemark`);
          const resolver = type.getFields()[`html`].resolve;

          // The args must be fixed becase excerpt is used later to determine if it represents the entire HTML.
          const result = await resolver(markdownRemarkNode, {}, context, info);
          return result;
        },
      };
    },
  });

  createFieldExtension({
    name: `needReadMore`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const type = info.schema.getType(`MarkdownPost`);
          const htmlResolver = type.getFields()[`html`].resolve;
          const excerptResolver = type.getFields()[`excerpt`].resolve;

          const html = await htmlResolver(source, {}, context, info);
          const excerpt = await excerptResolver(source, {}, context, info);
          return html !== excerpt;
        },
      };
    },
  });

  createFieldExtension({
    name: `tagInfos`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const { entries: postsIterator } = await context.nodeModel.findAll({
            type: `MarkdownPost`,
          });

          const tagsPerPosts = [...postsIterator].map(({ tags }) => tags);
          const allTags = tagsPerPosts?.flat().filter((tag) => tag);
          const allTagNames = allTags.map(({ name }) => name);
          const tagInfos = [...new Set(allTagNames)].map((name) => {
            const filtered = allTags.filter(({ name: n }) => n === name);
            const count = filtered.length;
            const slug = filtered[0].slug;

            return { name, count, slug };
          });

          return tagInfos;
        },
      };
    },
  });

  createFieldExtension({
    name: `yearInfos`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const type = info.schema.getType(`PostsInfo`);
          const resolver = type.getFields()[`yearMonthInfos`].resolve;

          const postsInfo = await context.nodeModel.findOne({
            type: `PostsInfo`,
          });

          // The `yearMonthInfos` is not existing when the node was created, so the resolver is required.
          const yearMonthInfos = await resolver(postsInfo, args, context, info);

          // Remove duplicates.
          const uniqueMap = new Map(
            yearMonthInfos.map((info) => [info.yearNumber, info])
          );

          const yearInfos = [...uniqueMap.values()].map(
            ({ yearNumber, yearString }) => {
              // Sum the monthly counts.
              const infos = yearMonthInfos.filter(
                ({ yearNumber: y }) => y === yearNumber
              );
              const count = infos.reduce(
                (total, { count }) => total + count,
                0
              );

              return { yearNumber, yearString, count };
            }
          );

          return yearInfos;
        },
      };
    },
  });

  createFieldExtension({
    name: `yearMonthInfos`,
    args: {
      locale: `String!`,
    },
    extend({ locale }) {
      return {
        async resolve(source, args, context, info) {
          const { entries: postsIterator } = await context.nodeModel.findAll({
            type: `MarkdownPost`,
          });
          const allDateInfos = [...postsIterator].map(({ date }) => {
            const d = new Date(date);
            const yearNumber = d.getFullYear();
            const yearString = d.toLocaleString(locale, { year: `numeric` });
            const monthNumber = d.getMonth();
            const monthString = d.toLocaleString(locale, { month: `short` });

            return { yearNumber, yearString, monthNumber, monthString };
          });

          // Remove duplicates.
          const uniqueMap = new Map(
            allDateInfos.map((info) => [
              `${info.yearString} ${info.monthString}`,
              info,
            ])
          );

          const yearMonthInfos = [...uniqueMap.values()].map((info) => {
            const count = allDateInfos.filter(
              ({ yearNumber, monthNumber }) =>
                yearNumber === info.yearNumber &&
                monthNumber === info.monthNumber
            ).length;

            return { ...info, count };
          });

          return yearMonthInfos;
        },
      };
    },
  });
};

exports.sourceNodes = (
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
exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
  const { createPage } = actions;

  const {
    archivesPath,
    basePath,
    cardsPerPage,
    debugPath,
    formatStringMonthAndDay,
    formatStringTime,
    formatStringYear,
    pagesPath,
    playgroundPath,
    postsPerPage,
    tagsPath,
  } = getOptions(themeOptions);

  // Get all markdown blog posts sorted by date
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
          yearString
        }        
        yearMonthInfos {
          count
          monthNumber
          monthString
          yearNumber
          yearString
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
        formatStringMonthAndDay,
        formatStringTime,
        formatStringYear,
        id: node.id,
        needDateTime: formatStringTime !== ``,
        needDateYear: formatStringYear !== ``,
        nextPostId: next?.id,
        previousPostId: previous?.id,
      },
    });
  });

  /**
   * Create main page with pagination.
   */
  const pagesTotal = result.data.pageInfoPassthrough.pageInfo.pageCount;

  [...new Array(pagesTotal)].forEach((_, i) => {
    createPage({
      path: i === 0 ? slugify(basePath) : slugify(basePath, pagesPath, i + 1),
      component: require.resolve("./src/templates/markdown-posts.js"),
      context: {
        formatStringMonthAndDay,
        formatStringTime,
        formatStringYear,
        limit: postsPerPage,
        needDateTime: formatStringTime !== ``,
        needDateYear: formatStringYear !== ``,
        pagesStartPath: basePath,
        skip: i * postsPerPage,
      },
    });
  });

  /**
   * Create tag page with pagination.
   */
  const tagInfos = result.data.postsInfo.tagInfos || [];
  tagInfos.forEach(({ name, slug, count }) => {
    const pagesTotal = Math.ceil(count / cardsPerPage); // TODO: Use `pageCount` instead of calc.
    const pagesStartPath = slugify(basePath, tagsPath, slug);

    [...new Array(pagesTotal)].forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? pagesStartPath
            : slugify(basePath, tagsPath, slug, pagesPath, i + 1),
        component: require.resolve(`./src/templates/tag.js`),
        context: {
          formatStringMonthAndDay,
          formatStringTime,
          formatStringYear,
          limit: cardsPerPage,
          needDateTime: formatStringTime !== ``,
          needDateYear: formatStringYear !== ``,
          pagesStartPath,
          pageTitle: name,
          skip: i * cardsPerPage,
          slug,
        },
      });
    });
  });

  /**
   * Create root archive page with pagination.
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
          : slugify(basePath, archivesPath, pagesPath, i + 1),
      component: require.resolve(`./src/templates/archive.js`),
      context: {
        dateGreaterThanEqual: `0000-01`,
        dateLessThan: `9999-13`,
        formatStringMonthAndDay,
        formatStringTime,
        formatStringYear,
        limit: cardsPerPage,
        needDateTime: formatStringTime !== ``,
        needDateYear: formatStringYear !== ``,
        pagesStartPath: archivesPagesStartPath,
        pageTitle: `Archives`,
        skip: i * cardsPerPage,
      },
    });
  });

  /**
   * Create year archive page with pagination.
   */
  const yearInfos = result.data.postsInfo.yearInfos || [];

  yearInfos.forEach(({ count, yearNumber, yearString }) => {
    const pagesTotal = Math.ceil(count / cardsPerPage);
    const yearPadded = yearNumber.toString().padStart(4, `0`);
    const nextPadded = (yearNumber + 1).toString().padStart(4, `0`);
    const pagesStartPath = slugify(basePath, archivesPath, yearPadded);

    [...new Array(pagesTotal)].forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? pagesStartPath
            : slugify(basePath, archivesPath, yearPadded, pagesPath, i + 1),
        component: require.resolve(`./src/templates/archive.js`),
        context: {
          dateGreaterThanEqual: yearPadded,
          dateLessThan: nextPadded,
          formatStringMonthAndDay,
          formatStringTime,
          formatStringYear,
          limit: cardsPerPage,
          needDateTime: formatStringTime !== ``,
          needDateYear: formatStringYear !== ``,
          pagesStartPath,
          pageTitle: yearString,
          skip: i * cardsPerPage,
        },
      });
    });
  });

  /**
   * Create month-and-year archive page with pagination.
   */
  const yearMonthInfos = result.data.postsInfo.yearMonthInfos || [];

  yearMonthInfos.forEach(
    ({ count, monthNumber, monthString, yearNumber, yearString }) => {
      const pagesTotal = Math.ceil(count / cardsPerPage);
      const yearPadded = yearNumber.toString().padStart(4, `0`);
      const monthPadded = (monthNumber + 1).toString().padStart(2, `0`);
      const nextPadded = `${yearPadded}-${(monthNumber + 2)
        .toString()
        .padStart(2, `0`)}`;
      const pagesStartPath = slugify(
        basePath,
        archivesPath,
        yearPadded,
        monthPadded
      );

      [...new Array(pagesTotal)].forEach((_, i) => {
        createPage({
          path:
            i === 0
              ? pagesStartPath
              : slugify(
                  basePath,
                  archivesPath,
                  yearPadded,
                  monthPadded,
                  pagesPath,
                  i + 1
                ),
          component: require.resolve(`./src/templates/archive.js`),
          context: {
            dateGreaterThanEqual: `${yearPadded}-${monthPadded}`,
            dateLessThan: nextPadded,
            formatStringMonthAndDay,
            formatStringTime,
            formatStringYear,
            limit: cardsPerPage,
            needDateTime: formatStringTime !== ``,
            needDateYear: formatStringYear !== ``,
            pagesStartPath,
            pageTitle: `${yearString} ${monthString}`,
            skip: i * cardsPerPage,
          },
        });
      });
    }
  );

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

  /**
   * Create a playground page.
   */
  if (process.env.NODE_ENV !== `production`) {
    createPage({
      path: slugify(basePath, playgroundPath),
      component: require.resolve(`./src/templates/playground.js`),
    });
  }
};

const createMarkdownPageNode = (
  { actions, createContentDigest, createNodeId, getNode, node },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;

  const { basePath } = getOptions(themeOptions);

  const { name } = getNode(node.parent);

  const slug = slugify(basePath, name);

  const fieldData = {
    canonicalUrl: node.frontmatter?.canonicalUrl || ``,
    heroImage: node.frontmatter?.heroImage,
    slug,
    title: node.frontmatter.title || name,
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

const createMarkdownPostNode = (
  { actions, createContentDigest, createNodeId, getNode, node },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;

  const { basePath, postPath } = getOptions(themeOptions);

  const { relativePath } = getNode(node.parent);
  const { dir, name } = parse(relativePath);
  const frontmatterSlug = node.frontmatter?.slug;

  const slug =
    frontmatterSlug ||
    (name === `index`
      ? slugify(basePath, postPath, ...dir.split(sep))
      : slugify(basePath, postPath, ...dir.split(sep), name));

  const modifiedTags =
    node.frontmatter.tags?.map((tag) => ({
      name: tag,
      slug: kebabCase(tag),
    })) || [];

  const fieldData = {
    canonicalUrl: node.frontmatter?.canonicalUrl || ``,
    date: node.frontmatter?.date || "2999-01-01 00:00",
    heroImage: node.frontmatter?.heroImage,
    slug,
    tags: modifiedTags,
    title: node.frontmatter.title || name,
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
exports.onCreateNode = (args, themeOptions) => {
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
