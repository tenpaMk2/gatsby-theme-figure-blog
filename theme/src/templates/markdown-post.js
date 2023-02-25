import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";
import {
  validateDate,
  validateHeroImage,
  validateHtml,
  validateSlug,
  validateTags,
  validateTitle,
} from "../libs/validation";

const MarkdownPostTemplate = ({ data: { current, next, previous } }) => {
  validateDate(current.date, current.id);
  validateHeroImage(current.heroImage, current.id);
  validateHtml(current.html, current.id);
  validateSlug(current.slug, current.id);
  validateTags(current.tags, current.id);
  validateTitle(current.title, current.id);

  const props = { current, next, previous };
  return <PostLayout {...props} />;
};

export default MarkdownPostTemplate;

export const Head = ({
  data: {
    current: { canonicalUrl, slug, title },
  },
}) => <Seo {...{ canonicalUrl, pathname: slug, title }} />;

export const postQuery = graphql`
  query (
    $id: String!
    $previousPostId: String
    $nextPostId: String
    $formatString: String
  ) {
    current: markdownPost(id: { eq: $id }) {
      canonicalUrl
      date(formatString: $formatString)
      heroImage {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
      html
      id
      slug
      tags {
        name
        slug
      }
      title
    }
    next: markdownPost(id: { eq: $nextPostId }) {
      slug
      title
    }
    previous: markdownPost(id: { eq: $previousPostId }) {
      slug
      title
    }
  }
`;
