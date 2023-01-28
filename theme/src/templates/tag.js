import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import PostCard from "../components/post-card";

const TagTemplate = ({
  data: {
    allMarkdownPost: { nodes: posts },
  },
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
      <h1 className="my-4 basis-full text-center text-4xl">🚧 tag name 🚧</h1>
      <div className="flex flex-wrap justify-center gap-2">{postCards}</div>
    </Layout>
  );
};

export default TagTemplate;

export const pageQuery = graphql`
  query TagQuery($slug: String!) {
    allMarkdownPost(
      filter: { tags: { elemMatch: { slug: { eq: $slug } } } }
      sort: { date: DESC }
    ) {
      nodes {
        date
        heroImage {
          childImageSharp {
            gatsbyImageData
          }
        }
        slug
        title
      }
    }
  }
`;
