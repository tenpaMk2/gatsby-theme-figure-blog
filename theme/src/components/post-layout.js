import React from "react";
import { Layout } from "../components/layout";
import { Post } from "../components/post";
import { PostNav } from "../components/post-nav";

export const PostLayout = ({ current, location, next, previous }) => {
  const postNav =
    !next && !previous ? null : (
      <PostNav
        previousSlug={previous?.slug}
        previousTitle={previous?.title}
        nextSlug={next?.slug}
        nextTitle={next?.title}
      />
    );

  return (
    <Layout>
      <Post {...{ ...current, location }} isPostPage={true} />
      {postNav}
    </Layout>
  );
};
