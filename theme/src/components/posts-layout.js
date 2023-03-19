import * as React from "react";
import { Layout } from "../components/layout";
import { Post } from "../components/post";
import { PagesNav } from "../components/pages-nav";

export const PostsLayout = ({
  currentPage,
  location,
  pageCount,
  pagesStartPath,
  posts,
}) => {
  if (posts.length === 0) {
    return (
      <Layout>
        <p>No posts❗</p>
      </Layout>
    );
  }

  const postComponents = posts.map((post) => {
    return (
      <Post key={post.slug} {...{ ...post, location }} isPostPage={false} />
    );
  });

  return (
    <Layout>
      {postComponents}
      <PagesNav
        currentPageNumber={currentPage}
        pagesStartPath={pagesStartPath}
        pagesTotal={pageCount}
      />
    </Layout>
  );
};
