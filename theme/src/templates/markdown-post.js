import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";
import { validateDate } from "../libs/validation";
import { getImage } from "gatsby-plugin-image";

export default ({ data: { current, next, previous }, location }) => {
  validateDate(current.date, current.id);

  const props = { current, location, next, previous };
  return <PostLayout {...props} />;
};

export const Head = ({
  data: {
    current: { canonicalUrl, description, heroImageAlt, seoImage, title },
  },
  location: { pathname },
}) => {
  const image = getImage(seoImage);

  return (
    <Seo
      {...{
        canonicalUrl,
        description,
        image: image
          ? {
              src: image.images.fallback.src,
              width: image.width,
              height: image.height,
              alt: heroImageAlt,
            }
          : undefined,
        pathname,
        title,
      }}
    />
  );
};

export const postQuery = graphql`
  query ($id: String!, $nextPostId: String, $previousPostId: String) {
    current: markdownPost(id: { eq: $id }) {
      canonicalUrl
      customHast
      date(formatString: "YYYY-MM-DDTHH:mm:ss.SSSZ")
      description
      heroImage {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
      heroImageAlt
      id
      seoImage: heroImage {
        childImageSharp {
          gatsbyImageData
        }
      }
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
