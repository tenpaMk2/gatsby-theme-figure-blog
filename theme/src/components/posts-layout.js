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

  const postComponents = posts.map(
    ({
      dateFormal,
      dateMonthAndDay,
      dateTime,
      dateYear,
      excerpt,
      heroImage,
      needReadMore,
      slug,
      tags,
      title,
    }) => {
      return (
        <Post
          key={slug}
          {...{
            dateFormal,
            dateMonthAndDay,
            dateTime,
            dateYear,
            heroImage,
            html: excerpt,
            isPostPage: false,
            location,
            needReadMore,
            slug,
            tags,
            title,
          }}
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
