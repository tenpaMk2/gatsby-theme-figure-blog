import { getOptions } from "./utils/default-options.mjs";
import {
  excerptASTToDescription,
  excerptASTToContentEncoded,
} from "./utils/rss.mjs";
import { customizeHast } from "./utils/hast.mjs";

/**
 * Max int value of GraphQL.
 */
const intMax = 2 ** 31 - 1;

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
      tags: [PostTag]!
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
      name: String!
      slug: String!
    }

    # Check the debug page for any forgotten definitions.
    type FigureBlogConfig implements Node {
      archivesPath: String!
      basePath: String!
      cardsPerPage: Int!
      debugPath: String!
      externalLinks: [ExternalLink]!
      intlYear: JSON!
      intlYearAndMonth: JSON!
      intlMonth: JSON!
      intlMonthAndDate: JSON!
      intlTime: JSON!
      locale: String!
      pagesPath: String!
      playgroundPath: String!
      postPath: String!
      postsPerPage: Int!
      rssNeedFullContent: Boolean!
      rssPruneLength: Int!
      rssTruncate: Boolean!
      tagsPath: String!
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
    }

    type YearMonthInfo {
      count: Int!
      monthNumber: Int!
      yearNumber: Int!
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

          return tagInfos.sort(({ name: a }, { name: b }) =>
            a.toLowerCase() < b.toLowerCase() ? -1 : 1
          );
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

          const yearInfos = [...uniqueMap.values()].map(({ yearNumber }) => {
            // Sum the monthly counts.
            const infos = yearMonthInfos.filter(
              ({ yearNumber: y }) => y === yearNumber
            );
            const count = infos.reduce((total, { count }) => total + count, 0);

            return { yearNumber, count };
          });

          return yearInfos.sort(
            ({ yearNumber: a }, { yearNumber: b }) => b - a
          );
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
            const monthNumber = d.getMonth();

            return { yearNumber, monthNumber };
          });

          // Remove duplicates.
          const uniqueMap = new Map(
            allDateInfos.map((info) => [
              `${info.yearNumber} ${info.monthNumber}`,
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

          return yearMonthInfos.sort(
            (
              { yearNumber: ay, monthNumber: am },
              { yearNumber: by, monthNumber: bm }
            ) => ay * 100 + am - (by * 100 + bm)
          );
        },
      };
    },
  });
};
