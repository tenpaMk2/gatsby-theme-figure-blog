import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "@tenpaMk2/gatsby-theme-figure-blog/src/components/seo";

const Home = ({ data }) => {
  const posts = data.allMarkdownPost.nodes;

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
        const title = post.title || `no title`;

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
                <small>{post.date}</small>
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

export const Head = () => <Seo isTopPage={true} />;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownPost(sort: { date: DESC }) {
      nodes {
        date(formatString: "YYYY-MM-DD HH:mm")
        excerpt
        title
      }
    }
  }
`;
