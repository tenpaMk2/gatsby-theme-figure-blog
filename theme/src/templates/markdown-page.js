import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";
import { validateHtml, validateSlug, validateTitle } from "../libs/validation";

const MarkdownPageTemplate = ({ data: { markdownPage } }) => {
  validateHtml(markdownPage.html, markdownPage.id);
  validateSlug(markdownPage.slug, markdownPage.id);
  validateTitle(markdownPage.title, markdownPage.id);

  return <PostLayout current={markdownPage} />;
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
