const { kebabCase } = require("./src/libs/kebab-case");
const { slugify } = require("./src/libs/slugify");
const { getOptions } = require("./utils/default-options");
const { parse, sep } = require("path");

const markdownResolverPassthrough =
  (fieldName) => async (source, args, context, info) => {
    const type = info.schema.getType(`MarkdownRemark`);
    const markdownNode = context.nodeModel.getNodeById({
      id: source.parent,
    });
    const resolver = type.getFields()[fieldName].resolve;
    const result = await resolver(markdownNode, args, context, info);
    return result;
  };

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions;

  // About `@fileByRelativePath` , see [Gatsby issue](https://github.com/gatsbyjs/gatsby/issues/18271) .
  const typeDefs = `
    type MarkdownPost implements Node {
      canonicalUrl: String
      date: Date! @dateformat
      excerpt(pruneLength: Int = 140, truncate: Boolean = true, format: MarkdownExcerptFormats = HTML): String! @markdownpassthrough(fieldName: "excerpt")
      heroImage: File @fileByRelativePath
      html: String! @markdownpassthrough(fieldName: "html")
      slug: String!
      tags: [PostTag]
      title: String!
    }

    type PostTag {
      name: String
      slug: String
    }

    type FigureBlogConfig implements Node {
      archivesPath: String
      basePath: String
      formatString: String
      postPath: String
      pagesPath: String
      tagsPath: String
    }

    type PostsInfo implements Node {
      tagInfos: [TagInfo]
      yearInfos: [YearInfo]
      yearMonthInfos: [YearMonthInfo]
    }

    type TagInfo {
      count: Int!
      name: String!
      slug: String!
    }
    
    type YearInfo {
      count: Int!
      year: String!
    }

    type YearMonthInfo {
      count: Int!
      month: String!
      year: String!
      yearMonth: String!
    }
  `;
  createTypes(typeDefs);

  createFieldExtension({
    name: `markdownpassthrough`,
    args: {
      fieldName: `String!`,
    },
    extend({ fieldName }) {
      return {
        resolve: markdownResolverPassthrough(fieldName),
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
    id: `@tenpamk2/gatsby-theme-figure-blog`,
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

  const allTags = posts
    ?.map(({ tags }) => tags)
    .flat()
    .filter((tag) => tag);
  const allTagNames = allTags.map(({ name }) => name);
  const tagInfos = Array.from(new Set(allTagNames)).map((name) => {
    const filtered = allTags.filter(({ name: n }) => n === name);
    const count = filtered.length;
    const slug = filtered[0].slug;

    return { name, count, slug };
  });

  const allYearMonths = posts.map(
    ({ date }) =>
      new Date(date).toLocaleString(`en-US`, {
        year: `numeric`,
        month: `short`,
      }) // TODO: locale from config.
  );
  const yearMonthInfos = Array.from(new Set(allYearMonths)).map((yearMonth) => {
    const count = allYearMonths.filter((ym) => ym === yearMonth).length;
    const d = new Date(yearMonth);
    const year = d.toLocaleString(`en-US`, { year: `numeric` });
    const month = d.toLocaleString(`en-US`, { month: `short` });

    return { yearMonth, count, year, month };
  });

  const allYears = yearMonthInfos.map(({ year }) => year);
  const yearInfos = Array.from(new Set(allYears)).map((year) => {
    const infos = yearMonthInfos.filter(({ year: y }) => y === year);
    const count = infos.reduce((total, { count }) => total + count, 0);

    return { year, count };
  });

  const postsInfo = { tagInfos, yearInfos, yearMonthInfos };

  createNode({
    ...postsInfo,
    id: `@tenpamk2/gatsby-theme-figure-blog-posts-info`,
    parent: null,
    children: [],
    internal: {
      type: `PostsInfo`,
      contentDigest: createContentDigest(postsInfo),
      content: JSON.stringify(postsInfo),
      description: `Posts info for @tenpamk2/gatsby-theme-figure-blog`,
    },
  });

  /**
   * Check for duplicate slugs.
   */
  const uniqueSlugs = Array.from(tagInfos.map(({ slug }) => slug));
  if (tagInfos.length !== uniqueSlugs.size) {
    console.table(tagInfos);
    reporter.warn(
      [
        `Duplicate slugs. Maybe, is there misspelling or capitalization error in the tag name?`,
        `Check the above table.`,
      ].join(` `)
    );
  }
};

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
  const { createPage } = actions;

  const { basePath, pagesPath, tagsPath } = getOptions(themeOptions);

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
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
      postsInfo {
        tagInfos {
          count
          name
          slug
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

  if (!edges?.length) {
    createPage({
      path: slugify(basePath),
      component: require.resolve("./src/templates/page.js"),
      context: {
        limit: 6,
        skip: 0,
        pagesTotal: 1,
        currentPageNumber: 1,
      },
    });

    return;
  }

  edges.forEach(({ node, next, previous }) => {
    createPage({
      path: node.slug,
      component: require.resolve(`./src/templates/blog-post.js`),
      context: {
        id: node.id,
        previousPostId: previous?.id,
        nextPostId: next?.id,
      },
    });
  });

  // Create `/page/{num}/`
  const postsPerPage = 6; // TODO: theme-options
  const pagesTotal = Math.ceil(edges.length / postsPerPage);

  [...new Array(pagesTotal)].forEach((_, i) => {
    createPage({
      path: i === 0 ? slugify(basePath) : slugify(basePath, pagesPath, i + 1),
      component: require.resolve("./src/templates/page.js"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        pagesTotal,
        currentPageNumber: i + 1,
      },
    });
  });

  const tagInfos = result?.data?.postsInfo?.tagInfos || [];
  tagInfos.forEach(({ name, slug }) => {
    createPage({
      path: slugify(basePath, tagsPath, slug),
      component: require.resolve(`./src/templates/tag.js`),
      context: { name, slug },
    });
  });
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = (
  { actions, createContentDigest, createNodeId, getNode, node },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;

  const { basePath, postPath } = getOptions(themeOptions);

  if (node.internal.type === `MarkdownRemark`) {
    const { relativePath } = getNode(node.parent);
    const { dir, name } = parse(relativePath);
    const slug = slugify(basePath, postPath, ...dir.split(sep), name);

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
      id: id,
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
  }
};
