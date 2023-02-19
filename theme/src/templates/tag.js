import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import PostCard from "../components/post-card";
import PagesNav from "../components/pages-nav";

const TagTemplate = ({
  data: {
    allMarkdownPost: {
      nodes: posts,
      pageInfo: { currentPage, pageCount },
    },
  },
  pageContext: { name: tagName, pagesStartPath },
}) => {
  const postCards = posts.map(({ title, date, slug, heroImage }) => (
    <PostCard
      key={slug}
      title={title}
      date={date}
      slug={slug}
      imagePath={heroImage}
    />
  ));

  return (
    <Layout>
      <h1 className="my-4 basis-full text-center text-4xl">{`🏷️ ${tagName} 🏷️`}</h1>
      {postCards}
      <PagesNav
        currentPageNumber={currentPage}
        pagesStartPath={pagesStartPath}
        pagesTotal={pageCount}
      />
    </Layout>
  );
};

export default TagTemplate;

export const pageQuery = graphql`
  query ($formatString: String, $limit: Int!, $skip: Int!, $slug: String!) {
    allMarkdownPost(
      filter: { tags: { elemMatch: { slug: { eq: $slug } } } }
      limit: $limit
      skip: $skip
      sort: { date: DESC }
    ) {
      nodes {
        date(formatString: $formatString)
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
