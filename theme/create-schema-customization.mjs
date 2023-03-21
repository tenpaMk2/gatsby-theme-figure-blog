import visitParents from "unist-util-visit-parents";
import { getOptions } from "./utils/default-options.mjs";
import {
  excerptASTToDescription,
  excerptASTToContentEncoded,
} from "./utils/rss.mjs";

/**
 * Max int value of GraphQL.
 */
const intMax = 2147483647;

/**
 * Customize hast.
 * See also [hast-to-jsx-runtime](./src/libs/hast-to-jsx-runtime.js) .
 * @param {Object} hast - HTML AST. See [syntax-tree](https://github.com/syntax-tree) .
 * @param {Object} context - `context` of the argument of resolver.
 */
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
 * Return resolver of MarkdownRemark nodes.
 * Refer to [@LekoArts](https://github.com/LekoArts/gatsby-themes/blob/main/packages/themes-utils/src/index.ts) .
 * @param {string} fieldName
 * @returns
 */
const markdownRemarkResolverPassThrough =
  (fieldName) => async (source, args, context, info) => {
    const type = info.schema.getType(`MarkdownRemark`);
    const markdownRemarkNode = context.nodeModel.getNodeById({
      id: source.parent,
    });
    const resolver = type.getFields()[fieldName].resolve;
    const result = await resolver(markdownRemarkNode, args, context, info);
    return result;
  };

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
export const createSchemaCustomization = ({ actions }, themeOptions) => {
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
      excerpt(pruneLength: Int = ${intMax}, truncate: Boolean = true, format: MarkdownExcerptFormats = HTML): String! @markdownRemarkResolverPassThrough(fieldName: "excerpt")
      excerptAst(pruneLength: Int = ${intMax}, truncate: Boolean = true): JSON! @markdownRemarkResolverPassThrough(fieldName: "excerptAst")

      # About \`@fileByRelativePath\` , see [Gatsby issue](https://github.com/gatsbyjs/gatsby/issues/18271) .
      # \`@fileByRelativePath\` works properly only if it has a \`File\` node as its ancestor.
      heroImage: File @fileByRelativePath

      html: String! @markdownRemarkResolverPassThrough(fieldName: "html")
      htmlAst: JSON! @markdownRemarkResolverPassThrough(fieldName: "htmlAst")
      needReadMore: Boolean! @needReadMore
      rssDescription(pruneLength: Int = ${rssPruneLength}, truncate: Boolean = ${rssTruncate}): String! @rssDescription
      rssContentEncoded(needFullContent: Boolean = ${rssNeedFullContent}, pruneLength: Int = ${rssPruneLength}, truncate: Boolean = ${rssTruncate}): String! @rssContentEncoded
      slug: String!
      tags: [PostTag]
      title: String!
    }

    type MarkdownPage implements FigureBlogMarkdown & Node {
      canonicalUrl: String
      customHast: JSON! @customHast
      heroImage: File @fileByRelativePath
      html: String! @markdownRemarkResolverPassThrough(fieldName: "html")
      htmlAst: JSON! @markdownRemarkResolverPassThrough(fieldName: "htmlAst")
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
    name: `markdownRemarkResolverPassThrough`,
    args: {
      fieldName: `String!`,
    },
    extend({ fieldName }) {
      return {
        resolve: markdownRemarkResolverPassThrough(fieldName),
      };
    },
  });

  createFieldExtension({
    name: `customExcerptHast`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const resolver = markdownRemarkResolverPassThrough(`excerptAst`);
          const hast = await resolver(
            source,
            {
              pruneLength: intMax, // Max value of 32bit signed integer.
              truncate: true, // Truncate the text even in the middle of a world. It is needed for CJK texts.
            },
            context,
            info
          );

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
          const resolver = markdownRemarkResolverPassThrough(`excerptAst`);
          const hast = await resolver(source, args, context, info);

          return excerptASTToDescription(hast);
        },
      };
    },
  });

  createFieldExtension({
    name: `rssContentEncoded`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const resolver = args.needFullContent
            ? markdownRemarkResolverPassThrough(`htmlAst`)
            : markdownRemarkResolverPassThrough(`excerptAst`);
          const hast = await resolver(
            source,
            args.needFullContent
              ? {}
              : {
                  pruneLength: args.pruneLength,
                  truncate: args.truncate,
                },
            context,
            info
          );

          const {
            siteMetadata: { siteUrl },
          } = await context.nodeModel.findOne({
            type: `Site`,
          });

          return excerptASTToContentEncoded(hast, siteUrl);
        },
      };
    },
  });

  createFieldExtension({
    name: `customHast`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const resolver = markdownRemarkResolverPassThrough(`htmlAst`);
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
          const htmlResolver = markdownRemarkResolverPassThrough(`html`);
          const html = await htmlResolver(source, args, context, info);
          const excerptResolver = markdownRemarkResolverPassThrough(`excerpt`);
          const excerpt = await excerptResolver(
            source,
            {
              pruneLength: intMax,
              format: `HTML`,
            },
            context,
            info
          );

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

          const tagsOfPosts = [...postsIterator].map(({ tags }) => tags);
          const allTags = tagsOfPosts?.flat().filter((tag) => tag);
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
