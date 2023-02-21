import * as React from "react";
import Layout from "../components/layout";
import Post from "../components/post";
import PagesNav from "../components/pages-nav";

export const PostsLayout = ({
  posts,
  currentPage,
  pagesStartPath,
  pageCount,
}) => {
  if (posts.length === 0) {
    return (
      <Layout>
        <p>No posts❗</p>
      </Layout>
    );
  }

  const postComponents = posts.map(
    ({ date, excerpt, slug, tags, title, needReadMore }) => {
      return (
        <Post
          key={slug}
          title={title}
          date={date}
          html={excerpt}
          slug={slug}
          tags={tags}
          needReadMore={needReadMore}
          isPostPage={false}
        />
      );
    }
  );

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
