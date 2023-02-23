import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostsLayout } from "../components/posts-layout";
import {
  validateDate,
  validateExcerpt,
  validateHeroImage,
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
  pageContext: { pagesStartPath },
}) => {
  if (nodes.length === 0) {
    console.warn(`No posts!!`);
  }

  nodes.forEach(({ date, excerpt, heroImage, id, slug, tags, title }) => {
    validateDate(date, id);
    validateExcerpt(excerpt, id);
    validateHeroImage(heroImage, id);
    validateSlug(slug, id);
    validateTags(tags, id);
    validateTitle(title, id);
  });

  const props = {
    posts: nodes,
    currentPage,
    pagesStartPath,
    pageCount,
  };
  return <PostsLayout {...props} />;
};

export default MarkdownPosts;

// `location` : See [Gatsby doc](https://www.gatsbyjs.com/docs/location-data-from-props/#getting-the-absolute-url-of-a-page)
export const Head = ({ location: { pathname } }) => <Seo {...{ pathname }} />;

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
