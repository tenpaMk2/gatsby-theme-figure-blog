const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
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

  const edges = result.data.allMarkdownRemark.edges;

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (edges.length > 0) {
    edges.forEach(({ node, next, previous }) => {
      createPage({
        path: node.fields.slug,
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
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
