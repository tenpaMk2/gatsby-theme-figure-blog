const { slugify } = require("./src/libs/slugify");

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

  const typeDefs = `
    type MarkdownPost implements Node {
      canonicalUrl: String
      date: Date! @dateformat
      excerpt(pruneLength: Int = 140, truncate: Boolean = true): String! @markdownpassthrough(fieldName: "excerpt")
      html: String! @markdownpassthrough(fieldName: "html")
      slug: String!
      title: String!
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

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownPost(sort: { date: ASC }) {
        edges {
          node {
            id
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
      postTags: allMarkdownRemark(sort: { frontmatter: { tags: ASC } }) {
        nodes {
          frontmatter {
            tags
          }
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

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (edges.length > 0) {
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
  }

  const nodesForTags = result.data.postTags.nodes;

  if (0 < nodesForTags.length) {
    const allTags = nodesForTags
      .map(({ frontmatter: { tags } }) => tags)
      .flat();

    const counts = {};
    allTags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });

    console.log(`tag and post-counts.`);
    console.log(counts);

    const uniqueTags = new Set(allTags);

    uniqueTags.forEach((tag) => {
      createPage({
        path: `/tags/${tag}`.replace(/\/\/+/g, `/`),
        component: require.resolve(`./src/templates/tag.js`),
        context: {
          tagName: tag,
        },
      });
    });
  }
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({
  actions,
  createContentDigest,
  createNodeId,
  getNode,
  node,
}) => {
  const { createNode, createParentChildLink } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const relativeFilePath = getNode(node.parent).relativePath;
    const subdirs = relativeFilePath.replace(/\.md$/g, ``).split(`/`);
    const slug = slugify(...subdirs);

    const fieldData = {
      canonicalUrl: node.frontmatter?.canonicalUrl || ``,
      date: node.frontmatter?.date ? node.frontmatter.date : "2099-01-01 00:00",
      slug,
      title: node.frontmatter.title
        ? node.frontmatter.title
        : subdirs.slice(-1),
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
