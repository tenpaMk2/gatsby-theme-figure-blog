import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostsLayout } from "../components/posts-layout";

const PagesTemplate = ({
  data: {
    allMarkdownPost: {
      nodes,
      pageInfo: { currentPage, pageCount },
    },
  },
  pageContext: { pagesStartPath },
}) => {
  if (nodes.length === 0) {
    console.warn(`No posts!!`);
  }

  nodes.forEach(
    ({ date, excerpt, heroImage, needReadMore, slug, tags, title }) => {
      if (date === `Invalid date`) {
        throw new Error(
          [
            `Invalid date!!`,
            `If you use the '/' as a separator, replace it with hyphens.`,
            `Ex) ❌: '2023/02/11 09:12' => ⭕: '2023-02-11 09:12'`,
            `If you set the hour to 1 digits, set it to 2 digits.`,
            `Ex) ❌: '2023-02-11 9:12' => ⭕: '2023-02-11 09:12'`,
          ].join(` `)
        );
      }

      if (!excerpt) {
        console.warn(`No excerpt!!`);
      }

      if (!slug) {
        console.warn(`No slug!!`);
      }

      if (!tags?.length) {
        console.warn(`No tags!!`);
      }

      if (!title) {
        console.warn(`No title!!`);
      }
    }
  );

  const props = {
    posts: nodes,
    currentPage,
    pagesStartPath,
    pageCount,
  };
  return <PostsLayout {...props} />;
};

export default PagesTemplate;

// `location` : See [Gatsby doc](https://www.gatsbyjs.com/docs/location-data-from-props/#getting-the-absolute-url-of-a-page)
export const Head = ({ location: { pathname } }) => (
  <Seo isTopPage={pathname === `/`} />
);

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!, $formatString: String) {
    allMarkdownPost(sort: { date: DESC }, limit: $limit, skip: $skip) {
      nodes {
        date(formatString: $formatString)
        excerpt
        heroImage {
          childImageSharp {
            gatsbyImageData
          }
        }
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
