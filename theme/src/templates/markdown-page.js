import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";

export default ({ data: { markdownPage }, location }) => {
  return <PostLayout current={markdownPage} location={location} />;
};

export const Head = ({
  data: {
    markdownPage: {
      canonicalUrl,
      seoImage: {
        childImageSharp: { gatsbyImageData: seoImage },
      },
      title,
    },
  },
  location: { pathname },
}) => (
  <Seo
    {...{
      canonicalUrl,
      image: {
        src: seoImage.images.fallback.src,
        width: seoImage.width,
        height: seoImage.height,
        alt: `TODO: temp`,
      },
      pathname,
      title,
    }}
  />
);

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
