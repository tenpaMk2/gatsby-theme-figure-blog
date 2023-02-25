import { Link } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import * as React from "react";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";

const Post = ({
  date,
  heroImage,
  html,
  needReadMore,
  isPostPage,
  slug,
  tags,
  title,
}) => {
  const { basePath, tagsPath } = queryBlogConfig();

  const image = getImage(heroImage);
  const imageComponent = image ? (
    <GatsbyImage
      image={image}
      alt="Hero image"
      objectPosition="50% 0%"
      className="aspect-video basis-full rounded bg-red-200"
    />
  ) : (
    <StaticImage
      src="../images/no-image.png"
      alt="No hero image"
      className="basis-full rounded"
    />
  );

  const h1 = isPostPage ? (
    <h1 itemProp="headline" className="basis-full text-4xl text-white">
      {title}
    </h1>
  ) : (
    <h1 itemProp="headline" className="basis-full text-4xl text-white">
      <Link to={slug} className="no-underline">
        {title}
      </Link>
    </h1>
  );

  const time = date ? (
    <time dateTime={date} className="basis-full text-gray-400">
      {date}
    </time>
  ) : null;

  const readMore = needReadMore ? (
    <p className="my-4 basis-full text-xl">
      <Link
        to={slug}
        className="flex w-max items-center rounded bg-sky-500 p-3 font-semibold leading-none text-white hover:bg-sky-400"
      >
        →Read More
      </Link>
    </p>
  ) : null;

  const tagLis = tags?.map(({ name, slug }) => (
    <li key={slug}>
      <Link to={slugify(basePath, tagsPath, slug)} className="underline">
        {name}
      </Link>
    </li>
  ));

  if (tagLis?.length) {
    tagLis.unshift(<li key="🏷️">🏷️</li>);
  }

  const tagOl = tagLis?.length ? (
    <ol className="flex basis-full flex-wrap gap-4">{tagLis}</ol>
  ) : null;

  return (
    <article
      className="flex min-w-0 basis-full flex-wrap gap-4 overflow-x-auto rounded-xl bg-slate-700 p-6"
      itemScope
      itemType="http://schema.org/Article"
    >
      <section className="flex min-w-0 basis-full flex-wrap gap-4">
        <header className="flex min-w-min basis-full flex-wrap justify-between gap-4">
          <div className="flex shrink grow basis-full flex-wrap content-start gap-4">
            {h1}
            {time}
            {tagOl}
          </div>
          <div className="flex basis-full justify-center">{imageComponent}</div>
          <hr className="basis-full border border-slate-500" />
        </header>
        <div className="flex min-w-0 basis-full flex-wrap justify-center gap-4">
          <section
            dangerouslySetInnerHTML={{ __html: html }}
            itemProp="articleBody"
            className="prose prose-invert max-w-full basis-full"
          />
        </div>
      </section>
      {readMore}
      <footer className="flex basis-full flex-wrap gap-4">
        <hr className="basis-full border border-slate-500" />
        {/* TODO: Add share buttons */}
      </footer>
    </article>
  );
};

export default Post;
