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
  validateDate(current.dateFormal, current.id);
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
    $formatStringMonthAndDay: String
    $formatStringTime: String
    $formatStringYear: String
    $id: String!
    $needDateTime: Boolean!
    $needDateYear: Boolean!
    $nextPostId: String
    $previousPostId: String
  ) {
    current: markdownPost(id: { eq: $id }) {
      canonicalUrl
      dateFormal: date(formatString: "YYYY-MM-DDTHH:mm:ss.sssZ")
      dateMonthAndDay: date(formatString: $formatStringMonthAndDay)
      dateTime: date(formatString: $formatStringTime)
        @include(if: $needDateTime)
      dateYear: date(formatString: $formatStringYear)
        @include(if: $needDateYear)
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
