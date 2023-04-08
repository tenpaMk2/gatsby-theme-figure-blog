import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";
import { validateDate } from "../libs/validation";

export default ({ data: { current, next, previous }, location }) => {
  validateDate(current.date, current.id);

  const props = { current, location, next, previous };
  return <PostLayout {...props} />;
};

export const Head = ({
  data: {
    current: { canonicalUrl, slug, title },
  },
}) => <Seo {...{ canonicalUrl, pathname: slug, title }} />;

export const postQuery = graphql`
  query ($id: String!, $nextPostId: String, $previousPostId: String) {
    current: markdownPost(id: { eq: $id }) {
      canonicalUrl
      customHast
      date(formatString: "YYYY-MM-DDTHH:mm:ss.SSSZ")
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
