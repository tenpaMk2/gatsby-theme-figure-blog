import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostsLayout } from "../components/posts-layout";
import { validateDate } from "../libs/validation";

export default ({
  data: {
    allMarkdownPost: {
      nodes,
      pageInfo: { currentPage, pageCount },
    },
  },
  location,
  pageContext: { pagesStartPath },
}) => {
  if (nodes.length === 0) {
    console.warn(`No posts!!`);
  }

  nodes.forEach(({ dateFormal, id }) => {
    validateDate(dateFormal, id);
  });

  const props = {
    currentPage,
    location,
    pageCount,
    pagesStartPath,
    posts: nodes,
  };
  return <PostsLayout {...props} />;
};

// `location` : See [Gatsby doc](https://www.gatsbyjs.com/docs/location-data-from-props/#getting-the-absolute-url-of-a-page)
export const Head = ({ location: { pathname } }) => <Seo {...{ pathname }} />;

export const pageQuery = graphql`
  query (
    $formatStringMonthAndDay: String
    $formatStringTime: String
    $formatStringYear: String
    $limit: Int!
    $needDateTime: Boolean!
    $needDateYear: Boolean!
    $skip: Int!
  ) {
    allMarkdownPost(sort: { date: DESC }, limit: $limit, skip: $skip) {
      nodes {
        customHast: customExcerptHast
        dateFormal: date(formatString: "YYYY-MM-DDTHH:mm:ss.SSSZ")
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
        id
        needReadMore
        slug
        tags {
          name
          slug
        }
        title
      }
      pageInfo {
        currentPage
        pageCount
      }
    }
  }
`;
