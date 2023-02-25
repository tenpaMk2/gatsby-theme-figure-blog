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

  posts.forEach(({ dateFormal, heroImage, id, slug, title }) => {
    validateDate(dateFormal, id);
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
  query (
    $limit: Int!
    $skip: Int!
    $slug: String!
    $formatStringMonthAndDay: String
    $formatStringTime: String
    $formatStringYear: String
  ) {
    allMarkdownPost(
      filter: { tags: { elemMatch: { slug: { eq: $slug } } } }
      limit: $limit
      skip: $skip
      sort: { date: DESC }
    ) {
      nodes {
        dateFormal: date(formatString: "YYYY-MM-DDTHH:mm:ss.sssZ")
        dateMonthAndDay: date(formatString: $formatStringMonthAndDay)
        dateTime: date(formatString: $formatStringTime)
        dateYear: date(formatString: $formatStringYear)
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
