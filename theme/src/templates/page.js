import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Post from "../components/post";
import PostsWrapper from "../components/posts-wrapper";

const Page = ({
  data: {
    allMarkdownPost: { nodes },
  },
}) => {
  const posts = nodes.map(({ date, excerpt, slug, tags, title }) => {
    return (
      <Post
        title={title}
        date={date}
        html={excerpt}
        slug={slug}
        tags={tags}
        needReadMore={true}
      />
    );
  });

  return (
    <Layout>
      <PostsWrapper>{posts}</PostsWrapper>
    </Layout>
  );
};

export default Page;

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
