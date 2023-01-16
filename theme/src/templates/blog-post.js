import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";

const BlogPostTemplate = ({
  data: { previous, next, site, markdownPost: post },
}) => {
  return (
    <article
      className="blog-post prose bg-slate-50 dark:prose-invert dark:bg-slate-700"
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline">{post.title}</h1>
        <p>{post.date}</p>
      </header>
      <section
        dangerouslySetInnerHTML={{ __html: post.html }}
        itemProp="articleBody"
      />
    </article>
  );
};

export default BlogPostTemplate;

export const Head = ({
  data: {
    markdownPost: { canonicalUrl, slug, title },
  },
}) => <Seo canonicalUrl={canonicalUrl} pathname={slug} title={title} />;

export const pageQuery = graphql`
  query BlogPostById(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownPost(id: { eq: $id }) {
      canonicalUrl
      date(formatString: "YYYY/MM/DD HH:mm:ss")
      excerpt(pruneLength: 160)
      html
      title
      slug
    }
    previous: markdownPost(id: { eq: $previousPostId }) {
      slug
      title
    }
    next: markdownPost(id: { eq: $nextPostId }) {
      slug
      title
    }
  }
`;
