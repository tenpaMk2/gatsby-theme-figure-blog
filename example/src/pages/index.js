import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "@tenpaMk2/gatsby-theme-figure-blog/src/components/seo";
import Layout from "@tenpaMk2/gatsby-theme-figure-blog/src/components/layout";
import Post from "@tenpaMk2/gatsby-theme-figure-blog/src/components/post";
import PostsWrapper from "@tenpaMk2/gatsby-theme-figure-blog/src/components/posts-wrapper";

// `location` : See [Gatsby doc](https://www.gatsbyjs.com/docs/location-data-from-props/#getting-the-absolute-url-of-a-page)
const Home = ({
  data: {
    allMarkdownPost: { nodes },
  },
  location,
}) => {
  if (nodes.length === 0) {
    return (
      <p>
        No blog posts found. Add markdown posts to "content/blog" (or the
        directory you specified for the "gatsby-source-filesystem" plugin in
        gatsby-config.js).
      </p>
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

export default Home;

export const Head = () => <Seo isTopPage={true} />;

export const pageQuery = graphql`
  query {
    allMarkdownPost(sort: { date: DESC }, limit: 6) {
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
