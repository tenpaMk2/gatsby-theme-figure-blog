import { Link } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import * as React from "react";
import { Border } from "./border";
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
  const isPortrait = image?.width < image?.height;
  const imageTag = image ? (
    <GatsbyImage image={image} alt="Hero image" className="basis-[56.25%]" />
  ) : (
    <StaticImage
      src="../images/no-image.png"
      alt="No hero image"
      className="basis-[56.25%]"
    />
  );

  return (
    <Link
      to={slug}
      className="min-w-0 max-w-lg grow basis-96 overflow-hidden rounded bg-slate-700 hover:bg-sky-800"
    >
      <article
        className={`flex aspect-square h-full w-full min-w-0 ${
          isPortrait ? `flex-row` : `flex-col`
        }`}
        itemScope
        itemType="http://schema.org/Article"
      >
        {imageTag}
        <header
          className={`flex min-h-0 min-w-0 basis-[43.75%] gap-2 p-2 ${
            isPortrait ? `flex-col` : `flex-row`
          }`}
        >
          <Clock {...{ dateFormal, dateMonthAndDay, dateTime, dateYear }} />
          <Border />
          <div className="flex content-center overflow-auto">
            {/* Need the wrapper div because `content-center` has an unexpected behavior when overflow. */}
            {/* See [StackOverflow](https://stackoverflow.com/questions/34184535/change-justify-content-value-when-flex-items-overflow-container) . */}
            <div className="my-auto">
              <PostTitle>{title}</PostTitle>
            </div>
          </div>
        </header>
      </article>
    </Link>
  );
};
