const visitParents = require("unist-util-visit-parents");
const { getOptions } = require("./utils/default-options");
const {
  excerptASTToDescription,
  excerptASTToContentEncoded,
} = require("./utils/rss");

const customizeHast = async (hast, context) => {
  // Store processing-targets.
  // We can't use async function ( `context.nodeModel.findOne()` ) in the `visitor()` of `visitParents()`
  // because `visitor()` must be non async function.
  // See [unist issues](https://github.com/syntax-tree/unist-util-visit-parents/issues/8#issuecomment-1413405543) .
  const targets = [];
  visitParents(hast, "element", (node, ancestor) => {
    if (ancestor.length !== 1) return;
    if (ancestor[0].type !== `root`) return;
    if (node.tagName !== `p`) return;
    if (node.children.length !== 1) return;
    if (node.children[0].tagName !== `a`) return;
    // Process only if the link is alone and placed at top level.

    const href = node.children[0].properties.href;
    const dummyOrigin = `https://example.com`; // TODO: Use `location` . See [website](https://nocache.org/p/check-if-an-url-is-internal-or-external-in-javascript-typescript) .
    const url = new URL(href, dummyOrigin);

    if (url.origin !== dummyOrigin) {
      return;
    }
    // Process only if this link is internal.

    if (!/^\//.test(href)) {
      return;
    }
    // Process only if this link is root relative URL.

    targets.push({ node, href });
  });

  // Process the targets.
  const promises = targets.map(async ({ node, href }) => {
    // `href` is percent encoded.
    const slug = decodeURI(href);

    const postNode = await context.nodeModel.findOne({
      type: `MarkdownPost`,
      query: {
        filter: { slug: { eq: slug } },
      },
    });
    const pageNode = await context.nodeModel.findOne({
      type: `MarkdownPage`,
      query: {
        filter: { slug: { eq: slug } },
      },
    });

    if (!postNode && !pageNode) return;
    // Process only if post or page node exist.

    node.tagName = `PostLinkCard`; // Sync this name with definitions in `src/libs/hast-to-jsx-runtime.js` .
    node.properties = { slug };
    node.children = [];
  });

  return Promise.all(promises);
};

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
module.exports = ({ actions }, themeOptions) => {
  const { createFieldExtension, createTypes } = actions;
  const { locale, rssNeedFullContent, rssPruneLength, rssTruncate } =
    getOptions(themeOptions);

  const typeDefs = `
    interface FigureBlogMarkdown {
      canonicalUrl: String
      heroImage: File
      html: String!
      id: ID!
      slug: String!
      title: String!
    }

    type MarkdownPost implements FigureBlogMarkdown & Node {
      canonicalUrl: String
      customHast: JSON! @customHast
      customExcerptHast: JSON! @customExcerptHast
      date: Date! @dateformat
      excerpt: String! @excerpt
      excerptAst: JSON! @excerptAst
      # About \`@fileByRelativePath\` , see [Gatsby issue](https://github.com/gatsbyjs/gatsby/issues/18271) .
      # \`@fileByRelativePath\` works properly only if it has a \`File\` node as its ancestor.
      heroImage: File @fileByRelativePath
      html: String! @html
      htmlAst: JSON! @htmlAst
      needReadMore: Boolean! @needReadMore
      rssDescription: String! @rssDescription
      rssContentEncoded: String! @rssContentEncoded
      slug: String!
      tags: [PostTag]
      title: String!
    }

    type MarkdownPage implements FigureBlogMarkdown & Node {
      canonicalUrl: String
      customHast: JSON! @customHast
      heroImage: File @fileByRelativePath
      html: String! @html
      htmlAst: JSON! @htmlAst
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
    name: `excerptAst`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const markdownRemarkNode = context.nodeModel.getNodeById({
            id: source.parent,
          });

          const type = info.schema.getType(`MarkdownRemark`);
          const resolver = type.getFields()[`excerptAst`].resolve;

          const result = await resolver(
            markdownRemarkNode,
            {
              pruneLength: 2147483647, // Max value of 32bit signed integer.
              truncate: true, // Truncate the text even in the middle of a world. It is needed for CJK texts.
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
    name: `customExcerptHast`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const type = info.schema.getType(`MarkdownPost`);
          const resolver = type.getFields()[`excerptAst`].resolve;
          const hast = await resolver(source, args, context, info);

          await customizeHast(hast, context);
          // After this line, `hast` is customized.

          return hast;
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
                pruneLength: rssPruneLength,
                truncate: rssTruncate,
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
    name: `htmlAst`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const markdownRemarkNode = context.nodeModel.getNodeById({
            id: source.parent,
          });

          const type = info.schema.getType(`MarkdownRemark`);
          const resolver = type.getFields()[`htmlAst`].resolve;

          const result = await resolver(
            markdownRemarkNode,
            args,
            context,
            info
          );
          return result;
        },
      };
    },
  });

  createFieldExtension({
    name: `customHast`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const type = info.schema.getType(`MarkdownPost`);
          const resolver = type.getFields()[`htmlAst`].resolve;
          const hast = await resolver(source, args, context, info);

          await customizeHast(hast, context);
          // After this line, `hast` is customized.

          return hast;
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
