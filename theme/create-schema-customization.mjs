import { toText as hastToText } from "hast-util-to-text";
import { getOptions } from "./utils/default-options.mjs";
import { hastToContentEncoded } from "./utils/rss.mjs";
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
  const {
    descriptionPruneLength,
    descriptionTruncate,
    locale,
    rssNeedFullContent,
    rssPruneLength,
    rssTruncate,
  } = getOptions(themeOptions);

  const typeDefs = `
    interface FigureBlogMarkdown {
      canonicalUrl: String
      description: String!
      heroImage: File
      heroImageAlt: String
      html: String!
      id: ID!
      isNSFW: Boolean!
      slug: String!
      title: String!
    }

    type MarkdownPost implements FigureBlogMarkdown & Node {
      canonicalUrl: String
      customHast: JSON! @customHast
      customExcerptHast: JSON! @customExcerptHast
      date: Date! @dateformat
      description(pruneLength: Int = ${descriptionPruneLength}, truncate: Boolean = ${descriptionTruncate}): String! @excerptText
      excerpt(pruneLength: Int = ${intMax}, truncate: Boolean = true, format: MarkdownExcerptFormats = HTML): String! @markdownRemarkResolverPassThrough(fieldName: "excerpt")
      excerptAst(pruneLength: Int = ${intMax}, truncate: Boolean = true): JSON! @markdownRemarkResolverPassThrough(fieldName: "excerptAst")

      # About \`@fileByRelativePath\` , see [Gatsby issue](https://github.com/gatsbyjs/gatsby/issues/18271) .
      # \`@fileByRelativePath\` works properly only if it has a \`File\` node as its ancestor.
      heroImage: File @fileByRelativePath
      heroImageAlt: String

      html: String! @markdownRemarkResolverPassThrough(fieldName: "html")
      htmlAst: JSON! @markdownRemarkResolverPassThrough(fieldName: "htmlAst")
      isNSFW: Boolean!
      needReadMore: Boolean! @needReadMore
      rssDescription(pruneLength: Int = ${rssPruneLength}, truncate: Boolean = ${rssTruncate}): String! @excerptText
      rssContentEncoded(needFullContent: Boolean = ${rssNeedFullContent}, pruneLength: Int = ${rssPruneLength}, truncate: Boolean = ${rssTruncate}): String! @rssContentEncoded
      slug: String!
      tags: [PostTag]!
      title: String!
    }

    type MarkdownPage implements FigureBlogMarkdown & Node {
      canonicalUrl: String
      customHast: JSON! @customHast
      description(pruneLength: Int = ${descriptionPruneLength}, truncate: Boolean = ${descriptionTruncate}): String! @excerptText
      heroImage: File @fileByRelativePath
      heroImageAlt: String
      html: String! @markdownRemarkResolverPassThrough(fieldName: "html")
      htmlAst: JSON! @markdownRemarkResolverPassThrough(fieldName: "htmlAst")
      isNSFW: Boolean!
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
      descriptionPrunedLength: Int!
      descriptionTruncate: Boolean!
      externalLinks: [ExternalLink]!
      intlYear: JSON!
      intlYearAndMonth: JSON!
      intlMonth: JSON!
      intlMonthAndDate: JSON!
      intlTime: JSON!
      locale: String!
      pagesPath: String!
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

    type TagInfo implements Node {
      count: Int!
      name: String!
      rank: Int!
      slug: String!
    }
    
    type YearInfo implements Node {
      count: Int!
      yearNumber: Int!
    }

    type YearMonthInfo implements Node {
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
    name: `excerptText`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const resolver = markdownRemarkResolverPassThrough(`excerptAst`);
          const hast = await resolver(source, args, context, info);

          return hastToText(hast);
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

          return hastToContentEncoded(hast, siteUrl);
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
};
