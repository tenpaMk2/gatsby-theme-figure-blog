import { Link } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import React from "react";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";
import { Border } from "./border";
import { Clock } from "./clock";
import { PostTitle } from "./post-title";

export const PostHeader = ({
  date,
  heroImage,
  isPostPage,
  slug,
  tags,
  title,
}) => {
  const { basePath, tagsPath } = queryBlogConfig();

  const h1 = isPostPage ? (
    <PostTitle>{title}</PostTitle>
  ) : (
    <PostTitle>
      <Link to={slug} className="no-underline">
        {title}
      </Link>
    </PostTitle>
  );

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

  const image = getImage(heroImage);
  const imageComponent = image ? (
    <GatsbyImage
      image={image}
      alt="Hero image"
      objectPosition="50% 0%"
      className="isolate aspect-video basis-full rounded" // `isolate` is needed to work around [iOS bug](https://gotohayato.com/content/556/) .
    />
  ) : (
    <StaticImage
      src="../images/no-image.png"
      alt="No hero image"
      className="isolate aspect-video basis-full rounded" // `isolate` is needed to work around [iOS bug](https://gotohayato.com/content/556/) .
    />
  );

  return (
    <header className="flex flex-col gap-4">
      <div className="flex w-full grow flex-wrap gap-4">
        <div className="flex basis-full flex-wrap gap-2">
          {date ? (
            <>
              <Clock {...{ date }} />
              <Border />
            </>
          ) : null}
          <div className="flex grow basis-1/2 content-center">{h1}</div>
        </div>
        {tagOl}
      </div>
      <div className="flex justify-center">{imageComponent}</div>
    </header>
  );
};
