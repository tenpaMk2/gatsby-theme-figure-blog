import { Link } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import * as React from "react";
import { Clock } from "./clock";
import { PostTitle } from "./post-title";

export const PostCard = ({
  dateFormal,
  dateMonthAndDay,
  dateTime,
  dateYear,
  slug,
  title,
  heroImage,
}) => {
  const image = getImage(heroImage);
  const imageTag = image ? (
    <GatsbyImage
      image={image}
      alt="hero image"
      className="isolate rounded" // `isolate` is needed to work around [iOS bug](https://gotohayato.com/content/556/) .
      objectFit="contain"
    />
  ) : (
    <StaticImage
      src="../images/no-image.png"
      alt="no-image"
      className="isolate rounded" // `isolate` is needed to work around [iOS bug](https://gotohayato.com/content/556/) .
      objectFit="contain"
      height={384} // Sync `gatsbyImageData(height: ***)`
    />
  );

  const basis =
    image?.width < image?.height ? `basis-[12rem]` : `basis-[31rem]`;

  return (
    <Link
      to={slug}
      className={`${basis} grow rounded bg-slate-700 text-gray-300 hover:bg-sky-800`}
    >
      <article
        className="flex flex-wrap gap-2 p-2 md:p-4"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header className="flex basis-full flex-wrap gap-2">
          <Clock {...{ dateFormal, dateMonthAndDay, dateTime, dateYear }} />
          <div className="border-r border-slate-500" />
          <PostTitle>{title}</PostTitle>
        </header>
        <section
          itemProp="articleBody"
          className="flex basis-full justify-center"
        >
          {imageTag}
        </section>
      </article>
    </Link>
  );
};
