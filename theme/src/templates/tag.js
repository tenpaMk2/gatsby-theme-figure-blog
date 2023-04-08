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

  posts.forEach(({ date, id }) => {
    validateDate(date, id);
  });

  const props = { posts, pageTitle, pagesStartPath, currentPage, pageCount };
  return <CardsLayout {...props} />;
};

export const Head = ({ location: { pathname } }) => (
  <Seo {...{ pathname, title: `Tag` }} />
);

export const pageQuery = graphql`
  query ($limit: Int!, $skip: Int!, $slug: String!) {
    allMarkdownPost(
      filter: { tags: { elemMatch: { slug: { eq: $slug } } } }
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
