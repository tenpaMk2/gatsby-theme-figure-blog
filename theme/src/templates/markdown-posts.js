import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostsLayout } from "../components/posts-layout";
import {
  validateDate,
  validateExcerpt,
  validateSlug,
  validateTags,
  validateTitle,
} from "../libs/validation";

const MarkdownPosts = ({
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

  nodes.forEach(({ dateFormal, excerpt, id, slug, tags, title }) => {
    validateDate(dateFormal, id);
    validateExcerpt(excerpt, id);
    validateSlug(slug, id);
    validateTags(tags, id);
    validateTitle(title, id);
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

export default MarkdownPosts;

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
        dateFormal: date(formatString: "YYYY-MM-DDTHH:mm:ss.sssZ")
        dateMonthAndDay: date(formatString: $formatStringMonthAndDay)
        dateTime: date(formatString: $formatStringTime)
          @include(if: $needDateTime)
        dateYear: date(formatString: $formatStringYear)
          @include(if: $needDateYear)
        excerpt
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
