import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import Layout from "../components/layout";
import Post from "../components/post";

const MarkdownPageTemplate = ({
  data: {
    markdownPage: { html, id, slug, title },
  },
}) => {
  validateHtml(html, id);
  validateSlug(slug, id);
  validateTitle(title, id);

  return (
    <Layout>
      <Post html={html} slug={slug} title={title} isPostPage={true} />
    </Layout>
  );
};

export default MarkdownPageTemplate;

export const Head = ({
  data: {
    markdownPage: { canonicalUrl, slug, title },
  },
}) => <Seo {...{ canonicalUrl, pathname: slug, title }} />;

export const postQuery = graphql`
  query ($id: String!) {
    markdownPage(id: { eq: $id }) {
      canonicalUrl
      html
      id
      slug
      title
    }
  }
`;
