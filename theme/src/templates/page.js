import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import Layout from "../components/layout";
import Post from "../components/post";
import PagesNav from "../components/pages-nav";

// `location` : See [Gatsby doc](https://www.gatsbyjs.com/docs/location-data-from-props/#getting-the-absolute-url-of-a-page)
const Page = ({
  data: {
    allMarkdownPost: { nodes },
  },
  pageContext,
  location,
}) => {
  const pagesTotal = pageContext.pagesTotal;
  if (!pagesTotal || pagesTotal <= 0) {
    return new Error("`pagesTotal` must be integer and greater than 1.");
  }

  const currentPageNumber = pageContext.currentPageNumber;
  if (!currentPageNumber || currentPageNumber <= 0) {
    return new Error("`currentPageNumber` must be integer and greater than 0.");
  }
  if (pagesTotal < currentPageNumber) {
    return new Error(
      "`currentPageNumber` must be less than equal `pagesTotal` ."
    );
  }

  if (!nodes?.length) {
    return (
      <Layout>
        <p>No posts❗</p>
      </Layout>
    );
  }

  const posts = nodes.map(({ date, excerpt, slug, tags, title }) => {
    return (
      <Post
        title={title}
        date={date}
        html={excerpt}
        slug={slug}
        tags={tags}
        isPostPage={false}
      />
    );
  });

  return (
    <Layout>
      {posts}
      <PagesNav
        currentPageNumber={currentPageNumber}
        pagesTotal={pagesTotal}
        needNumberLinks={true}
      />
    </Layout>
  );
};

export default Page;

export const Head = () => <Seo isTopPage={true} />;

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownPost(sort: { date: DESC }, limit: $limit, skip: $skip) {
      nodes {
        date
        excerpt
        heroImage {
          childImageSharp {
            gatsbyImageData
          }
        }
        slug
        tags {
          name
          slug
        }
        title
      }
    }
  }
`;
