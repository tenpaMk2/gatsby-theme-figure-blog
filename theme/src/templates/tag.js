import * as React from "react";
import { graphql } from "gatsby";
import { CardsLayout } from "../components/cards-layout";
import {
  validateDate,
  validateHeroImage,
  validateSlug,
  validateTitle,
} from "../libs/validation";

const TagTemplate = ({
  data: {
    allMarkdownPost: {
      nodes: posts,
      pageInfo: { currentPage, pageCount },
    },
  },
  pageContext: { name: tagName, pagesStartPath },
}) => {
  if (posts.length === 0) {
    console.warn(`No posts!!`);
  }

  posts.forEach(({ date, heroImage, id, slug, title }) => {
    validateDate(date, id);
    validateHeroImage(heroImage, id);
    validateSlug(slug, id);
    validateTitle(title, id);
  });

  const props = { posts, tagName, pagesStartPath, currentPage, pageCount };
  return <CardsLayout {...props} />;
};

export default TagTemplate;

// FIXME: add seo.

export const pageQuery = graphql`
  query ($formatString: String, $limit: Int!, $skip: Int!, $slug: String!) {
    allMarkdownPost(
      filter: { tags: { elemMatch: { slug: { eq: $slug } } } }
      limit: $limit
      skip: $skip
      sort: { date: DESC }
    ) {
      nodes {
        date(formatString: $formatString)
        heroImage {
          childImageSharp {
            gatsbyImageData(height: 384)
          }
        }
        slug
        title
      }
      pageInfo {
        currentPage
        pageCount
      }
    }
  }
`;
