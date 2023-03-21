import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";

const MarkdownPageTemplate = ({ data: { markdownPage }, location }) => {
  return <PostLayout current={markdownPage} location={location} />;
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
      customHast
      id
      slug
      title
    }
  }
`;
