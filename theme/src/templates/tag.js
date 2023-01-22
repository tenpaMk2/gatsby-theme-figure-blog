import * as React from "react";
import { graphql } from "gatsby";

const TagTemplate = ({
  data: {
    allMarkdownPost: { nodes: posts },
  },
}) => {
  const postCards = posts.map(({ title, date }) => {
    return (
      <article itemScope itemType="http://schema.org/Article">
        <header>
          <h1 itemProp="headline">{title}</h1>
          <time itemProp="dateCreated datePublished" dateTime={date}>
            {date}
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
  query TagQuery($slug: String!) {
    allMarkdownPost(filter: { tags: { elemMatch: { slug: { eq: $slug } } } }) {
      nodes {
        tags {
          name
          slug
        }
        slug
        title
        date
        excerpt
      }
    }
  }
`;
