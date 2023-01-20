import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import Layout from "../components/layout";

const BlogPostTemplate = ({
  data: { previous, next, site, markdownPost: post },
}) => {
  return (
    <Layout>
      <article
        className="blog-post prose prose-invert m-8 w-full max-w-screen-lg rounded-xl bg-slate-700 p-8"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline mb-0">{post.title}</h1>
          <p>{post.date}</p>
          <hr className="border border-slate-500" />
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
      </article>
    </Layout>
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
      slug
      title
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
