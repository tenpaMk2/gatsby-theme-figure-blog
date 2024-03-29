import React from "react";
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
    ({ date, slug, title, heroImage, heroImageAlt }) => (
      <PostCard
        key={slug}
        {...{
          date,
          slug,
          title,
          heroImage,
          heroImageAlt,
        }}
      />
    )
  );

  return (
    <Layout>
      <h1 className="my-4 min-w-0 basis-full overflow-auto text-center text-xl md:text-4xl">
        {pageTitle}
      </h1>
      <div className="grid min-w-0 basis-full grid-cols-1 gap-4 md:grid-cols-2">
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
