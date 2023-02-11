import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import Layout from "../components/layout";
import Post from "../components/post";
import { PostNav } from "../components/post-nav";

const BlogPostTemplate = ({ data: { current, next, previous } }) => {
  const title = current?.title || ``;
  const date = current?.date || ``;
  const html = current?.html || ``;
  const slug = current?.slug || ``;
  const tags = current?.tags || [];

  if (date === `Invalid date`) {
    throw new Error(
      [
        `Invalid date!!`,
        `Don't use the \`/\`  as separator.`,
        `e.g., ❌: \`2023/02/11 09:12\` => ⭕: \`2023-02-11 09:12\` .`,
        `Set the hour to 2 digits,`,
        `e.g., ❌: \`2023-02-11 9:12\` => ⭕: \`2023-02-11 09:12\` .`,
      ].join(` `)
    );
  }

  return (
    <Layout>
      <Post
        title={title}
        date={date}
        html={html}
        slug={slug}
        tags={tags}
        isPostPage={true}
      />
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
  query (
    $id: String!
    $previousPostId: String
    $nextPostId: String
    $formatString: String
  ) {
    current: markdownPost(id: { eq: $id }) {
      canonicalUrl
      date(formatString: $formatString)
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
