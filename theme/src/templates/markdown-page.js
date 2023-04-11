import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";
import { getImage } from "gatsby-plugin-image";

export default ({ data: { markdownPage }, location }) => {
  return <PostLayout current={markdownPage} location={location} />;
};

export const Head = ({
  data: {
    markdownPage: { canonicalUrl, description, heroImageAlt, seoImage, title },
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
  query ($id: String!) {
    markdownPage(id: { eq: $id }) {
      canonicalUrl
      customHast
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
      title
    }
  }
`;
