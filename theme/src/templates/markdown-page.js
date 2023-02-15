import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import Layout from "../components/layout";
import Post from "../components/post";

const BlogPostTemplate = ({ data: { markdownPage } }) => {
  const html = markdownPage?.html || ``;
  const slug = markdownPage?.slug || ``;
  const title = markdownPage?.title || ``;

  return (
    <Layout>
      <Post title={title} html={html} slug={slug} isPostPage={true} />
    </Layout>
  );
};

export default BlogPostTemplate;

export const Head = ({
  data: {
    markdownPage: { canonicalUrl, slug, title },
  },
}) => <Seo canonicalUrl={canonicalUrl} pathname={slug} title={title} />;

export const postQuery = graphql`
  query ($id: String!) {
    markdownPage(id: { eq: $id }) {
      canonicalUrl
      html
      slug
      title
    }
  }
`;
