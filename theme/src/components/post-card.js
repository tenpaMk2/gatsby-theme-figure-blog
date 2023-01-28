import { Link } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import * as React from "react";

const PostCard = ({ title, date, slug, imagePath }) => {
  const image = getImage(imagePath);
  const imageTag = image ? (
    <GatsbyImage
      image={image}
      alt="hero image"
      className="max-h-96"
      objectFit="contain"
    />
  ) : (
    <StaticImage
      src="../images/no-image.jpg"
      alt="no-image"
      className="max-h-96"
      objectFit="contain"
    />
  );

  const basis =
    image?.width < image?.height ? `basis-[12rem]` : `basis-[31rem]`;

  return (
    <article
      className={`${basis} grow rounded bg-slate-700 p-4 text-gray-300`}
      itemScope
      itemType="http://schema.org/Article"
    >
      <Link to={slug}>
        <header>
          <h1 className="mb-0 text-xl" itemProp="headline">
            {title}
          </h1>
          <time className="text-gray-400" datetime={date}>
            {date}
          </time>
        </header>
        <section itemProp="articleBody" className="max-h-96 text-center">
          {imageTag}
        </section>
      </Link>
    </article>
  );
};

export default PostCard;
