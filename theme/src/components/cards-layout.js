import * as React from "react";
import { Layout } from "./layout";
import { PostCard } from "./post-card";
import { PagesNav } from "./pages-nav";

export const CardsLayout = ({
  posts,
  pageTitle,
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
      <h1 className="my-4 min-w-0 basis-full overflow-auto text-center text-xl md:text-4xl">
        {pageTitle}
      </h1>
      <div className="flex min-w-0 basis-full flex-wrap items-start gap-4">
        {postCards}
      </div>
      <PagesNav
        currentPageNumber={currentPage}
        pagesStartPath={pagesStartPath}
        pagesTotal={pageCount}
      />
    </Layout>
  );
};
