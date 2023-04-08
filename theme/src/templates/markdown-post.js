import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";
import { validateDate } from "../libs/validation";

export default ({ data: { current, next, previous }, location }) => {
  validateDate(current.dateFormal, current.id);

  const props = { current, location, next, previous };
  return <PostLayout {...props} />;
};

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
      customHast
      dateFormal: date(formatString: "YYYY-MM-DDTHH:mm:ss.SSSZ")
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
