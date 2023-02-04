import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import Layout from "../components/layout";
import Post from "../components/post";
import PostsWrapper from "../components/posts-wrapper";
import { PostNav } from "../components/post-nav";

const BlogPostTemplate = ({ data: { current, next, previous } }) => {
  const title = current?.title || ``;
  const date = current?.date || ``;
  const html = current?.html || ``;
  const slug = current?.slug || ``;
  const tags = current?.tags || [];

  return (
    <Layout>
      <PostsWrapper>
        <Post title={title} date={date} html={html} slug={slug} tags={tags} />
      </PostsWrapper>
      <PostNav
        previousSlug={previous?.slug}
        previousTitle={previous?.title}
        nextSlug={next?.slug}
        nextTitle={next?.title}
      />
    </Layout>
  );
};

export default BlogPostTemplate;

export const Head = ({
  data: {
    current: { canonicalUrl, slug, title },
  },
}) => <Seo canonicalUrl={canonicalUrl} pathname={slug} title={title} />;

export const postQuery = graphql`
  query ($id: String!, $previousPostId: String, $nextPostId: String) {
    current: markdownPost(id: { eq: $id }) {
      canonicalUrl
      date(formatString: "YYYY/MM/DD HH:mm:ss")
      html
      slug
      tags {
        name
        slug
      }
      title
    }
    next: markdownPost(id: { eq: $nextPostId }) {
      slug
      title
    }
    previous: markdownPost(id: { eq: $previousPostId }) {
      slug
      title
    }
  }
`;
