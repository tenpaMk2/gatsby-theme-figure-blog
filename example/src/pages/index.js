import * as React from "react";
import { graphql } from "gatsby";

const Home = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <p>
        No blog posts found. Add markdown posts to "content/blog" (or the
        directory you specified for the "gatsby-source-filesystem" plugin in
        gatsby-config.js).
      </p>
    );
  }

  return (
    <ol>
      {posts.map((post) => {
        const title = post.frontmatter.title || `no title`;

        return (
          <li key={title}>
            <article
              className="post-list-item"
              itemScope
              itemType="http://schema.org/Article"
            >
              <header>
                <h2>
                  <span itemProp="headline">{title}</span>
                </h2>
                <small>{post.frontmatter.date}</small>
              </header>
              <section>
                <p itemProp="description">{post.excerpt}</p>
              </section>
            </article>
          </li>
        );
      })}
    </ol>
  );
};

export default Home;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
// export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        frontmatter {
          date(formatString: "YYYY-MM-DD HH:mm")
          title
        }
      }
    }
  }
`;
