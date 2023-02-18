import React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import Layout from "../components/layout";
import Post from "../components/post";
import PagesNav from "../components/pages-nav";

const Page = ({
  data: {
    allMarkdownPost: { nodes },
  },
  pageContext,
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

  const posts = nodes.map(
    ({ date, excerpt, slug, tags, title, needReadMore }) => {
      return (
        <Post
          key={slug}
          title={title}
          date={date}
          html={excerpt}
          slug={slug}
          tags={tags}
          needReadMore={needReadMore}
          isPostPage={false}
        />
      );
    }
  );

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
    }
  }
`;
