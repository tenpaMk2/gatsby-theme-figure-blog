import React from "react";
import { graphql } from "gatsby";
import { CardsLayout } from "../components/cards-layout";
import { validateDate } from "../libs/validation";
import { Seo } from "../components/seo";

export default ({
  data: {
    allMarkdownPost: {
      nodes: posts,
      pageInfo: { currentPage, pageCount },
    },
  },
  pageContext: { pageTitle, pagesStartPath },
}) => {
  if (posts.length === 0) {
    console.warn(`No posts!!`);
  }

  for (const { date, id } of posts) {
    validateDate(date, id);
  }

  const props = { posts, pageTitle, pagesStartPath, currentPage, pageCount };
  return <CardsLayout {...props} />;
};

export const Head = ({
  location: { pathname },
  pageContext: { pageTitle: title },
}) => <Seo {...{ pathname, title }} />;

export const pageQuery = graphql`
  query (
    $dateGreaterThanEqual: Date
    $dateLessThan: Date
    $limit: Int!
    $skip: Int!
  ) {
    allMarkdownPost(
      filter: { date: { gte: $dateGreaterThanEqual, lt: $dateLessThan } }
      limit: $limit
      skip: $skip
      sort: { date: DESC }
    ) {
      nodes {
        date(formatString: "YYYY-MM-DDTHH:mm:ss.SSSZ")
        heroImage {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
        heroImageAlt
        id
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
