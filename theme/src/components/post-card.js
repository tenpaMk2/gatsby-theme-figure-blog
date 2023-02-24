import { Link } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import * as React from "react";

const PostCard = ({ title, date, slug, imagePath }) => {
  const image = getImage(imagePath);
  const imageTag = image ? (
    <GatsbyImage
      image={image}
      alt="hero image"
      className="rounded"
      objectFit="contain"
    />
  ) : (
    <StaticImage
      src="../images/no-image.png"
      alt="no-image"
      className="rounded"
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
        className="flex flex-wrap gap-2 p-4"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header className="flex basis-full flex-wrap">
          <h1 className="basis-full text-xl" itemProp="headline">
            {title}
          </h1>
          <time className="basis-full text-gray-400" dateTime={date}>
            {date}
          </time>
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

export default PostCard;
