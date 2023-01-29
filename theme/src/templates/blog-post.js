import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import Layout from "../components/layout";
import Post from "../components/post";
import PostsWrapper from "../components/posts-wrapper";

const BlogPostTemplate = ({
  data: { previous, next, site, markdownPost: post },
}) => {
  return (
    <Layout>
      <PostsWrapper>
        <Post
          title={post.title}
          date={post.date}
          html={post.html}
          slug={post.slug}
          tags={post.tags}
        />
      </PostsWrapper>
      <div className="m-8 flex w-full justify-between text-xl">
        <p>🚧previous🚧</p>
        <p>🚧next🚧</p>
      </div>
    </Layout>
  );
};

export default BlogPostTemplate;

export const Head = ({
  data: {
    markdownPost: { canonicalUrl, slug, title },
  },
}) => <Seo canonicalUrl={canonicalUrl} pathname={slug} title={title} />;

export const postQuery = graphql`
  query ($id: String!, $previousPostId: String, $nextPostId: String) {
    site {
      siteMetadata {
        title
      }
    }
    markdownPost(id: { eq: $id }) {
      canonicalUrl
      date(formatString: "YYYY/MM/DD HH:mm:ss")
      excerpt(pruneLength: 160)
      html
      slug
      tags {
        name
        slug
      }
      title
    }
    previous: markdownPost(id: { eq: $previousPostId }) {
      slug
      title
    }
    next: markdownPost(id: { eq: $nextPostId }) {
      slug
      title
    }
  }
`;
