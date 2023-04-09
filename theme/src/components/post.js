import React from "react";
import { Link } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { Border } from "./border";
import { ShareButtons } from "./share-buttons";
import { PostHeader } from "./post-header";
import { hastToReactComponents } from "../libs/hast-to-jsx-runtime";

export const Post = ({
  customHast,
  date,
  heroImage,
  heroImageAlt,
  isPostPage,
  location,
  needReadMore,
  slug,
  tags,
  title,
}) => {
  const imageSrc = getImage(heroImage)?.images?.fallback?.src;

  const react = hastToReactComponents(customHast);

  return (
    <article
      className="flex min-w-0 basis-full flex-col gap-4 overflow-x-auto rounded-xl bg-slate-700 p-2 md:p-6"
      itemScope
      itemType="http://schema.org/Article"
    >
      <PostHeader
        {...{
          date,
          heroImage,
          heroImageAlt,
          isPostPage,
          slug,
          tags,
          title,
        }}
      />
      <Border />
      <div className="flex flex-col gap-4">
        <div
          itemProp="articleBody"
          className="prose prose-invert max-w-full basis-full"
        >
          {react}
        </div>
        {needReadMore ? (
          <p>
            <Link
              to={slug}
              className="inline-block rounded bg-sky-500 p-3 text-xl font-semibold leading-none text-white hover:bg-sky-400"
            >
              →Read More
            </Link>
          </p>
        ) : null}
      </div>
      {isPostPage ? (
        <>
          <Border />
          <footer>
            <ShareButtons {...{ imageSrc, location, title }} />
          </footer>
        </>
      ) : null}
    </article>
  );
};
