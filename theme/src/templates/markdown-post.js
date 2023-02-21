import * as React from "react";
import { graphql } from "gatsby";
import { Seo } from "../components/seo";
import { PostLayout } from "../components/post-layout";

const MarkdownPostTemplate = ({ data: { current, next, previous } }) => {
  if (!current.title) {
    console.warn(`No title!!`);
  }

  if (current.date === `Invalid date`) {
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

  if (!current.html) {
    console.warn(`No HTML!!`);
  }

  if (!current.slug) {
    console.warn(`No slug!!`);
  }

  if (!current.tags?.length) {
    console.warn(`No tags!!`);
  }

  if (!previous.title) {
    console.warn(`No title in previous post!!`);
  }

  if (!previous.slug) {
    console.warn(`No slug in previous post!!`);
  }

  if (!next.title) {
    console.warn(`No title in next post!!`);
  }

  if (!next.slug) {
    console.warn(`No slug in next post!!`);
  }

  const props = { current, next, previous };
  return <PostLayout {...props} />;
};

export default MarkdownPostTemplate;

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
