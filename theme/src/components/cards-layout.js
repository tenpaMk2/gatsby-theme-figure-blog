import * as React from "react";
import { Layout } from "./layout";
import { PostCard } from "./post-card";
import { PagesNav } from "./pages-nav";

export const CardsLayout = ({
  posts,
  tagName,
  pagesStartPath,
  currentPage,
  pageCount,
}) => {
  const postCards = posts.map(
    ({
      dateFormal,
      dateMonthAndDay,
      dateTime,
      dateYear,
      slug,
      title,
      heroImage,
    }) => (
      <PostCard
        key={slug}
        {...{
          dateFormal,
          dateMonthAndDay,
          dateTime,
          dateYear,
          slug,
          title,
          heroImage,
        }}
      />
    )
  );

  return (
    <Layout>
      <h1 className="my-4 basis-full text-center text-xl md:text-4xl">{`🏷️ ${tagName} 🏷️`}</h1>
      {postCards}
      <PagesNav
        currentPageNumber={currentPage}
        pagesStartPath={pagesStartPath}
        pagesTotal={pageCount}
      />
    </Layout>
  );
};
