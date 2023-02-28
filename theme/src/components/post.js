import * as React from "react";
import { Link } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { Border } from "./border";
import { ShareButtons } from "./share-buttons";
import { PostHeader } from "./post-header";

export const Post = ({
  dateFormal,
  dateMonthAndDay,
  dateTime,
  dateYear,
  heroImage,
  html,
  location,
  needReadMore,
  isPostPage,
  slug,
  tags,
  title,
}) => {
  const imageSrc = getImage(heroImage)?.images?.fallback?.src;

  const readMore = needReadMore ? (
    <p className="text-xl">
      <Link
        to={slug}
        className="rounded bg-sky-500 p-3 font-semibold leading-none text-white hover:bg-sky-400"
      >
        →Read More
      </Link>
    </p>
  ) : null;

  return (
    <article
      className="flex min-w-0 basis-full flex-col gap-4 overflow-x-auto rounded-xl bg-slate-700 p-2 md:p-6"
      itemScope
      itemType="http://schema.org/Article"
    >
      <PostHeader
        {...{
          dateFormal,
          dateMonthAndDay,
          dateTime,
          dateYear,
          heroImage,
          isPostPage,
          slug,
          tags,
          title,
        }}
      />
      <Border />
      <div className="flex flex-col gap-4">
        <section
          dangerouslySetInnerHTML={{ __html: html }}
          itemProp="articleBody"
          className="prose prose-invert max-w-full basis-full"
        />
        {readMore}
      </div>
      <Border />
      <footer>
        {isPostPage ? (
          <ShareButtons {...{ imageSrc, location, title }} />
        ) : null}
      </footer>
    </article>
  );
};
