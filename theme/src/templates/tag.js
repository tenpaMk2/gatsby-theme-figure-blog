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

  posts.forEach(({ dateFormal, id }) => {
    validateDate(dateFormal, id);
  });

  const props = { posts, pageTitle, pagesStartPath, currentPage, pageCount };
  return <CardsLayout {...props} />;
};

export const Head = ({ location: { pathname } }) => (
  <Seo {...{ pathname, title: `Tag` }} />
);

export const pageQuery = graphql`
  query (
    $formatStringMonthAndDay: String
    $formatStringTime: String
    $formatStringYear: String
    $limit: Int!
    $needDateTime: Boolean!
    $needDateYear: Boolean!
    $skip: Int!
    $slug: String!
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
          @include(if: $needDateTime)
        dateYear: date(formatString: $formatStringYear)
          @include(if: $needDateYear)
        heroImage {
          childImageSharp {
            gatsbyImageData
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
