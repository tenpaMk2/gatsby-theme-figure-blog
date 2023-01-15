import * as React from "react";
import { graphql } from "gatsby";

const TagTemplate = ({
  data: {
    allMarkdownRemark: { nodes: posts },
  },
}) => {
  const postCards = posts.map((post) => {
    return (
      <article itemScope itemType="http://schema.org/Article">
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <time
            itemProp="dateCreated datePublished"
            dateTime={post.frontmatter.date}
          >
            {post.frontmatter.date}
          </time>
        </header>
        <section itemProp="articleBody">{post.excerpt}</section>
      </article>
    );
  });

  return <main>{postCards}</main>;
};

export default TagTemplate;

export const pageQuery = graphql`
  query TagQuery($tagName: String!) {
    allMarkdownRemark(filter: { frontmatter: { tags: { in: [$tagName] } } }) {
      nodes {
        frontmatter {
          title
          date
        }
        excerpt
      }
    }
  }
`;
