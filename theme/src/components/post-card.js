import { graphql, Link, useStaticQuery } from "gatsby";
import {
  GatsbyImage,
  getImage,
  getSrc,
  StaticImage,
} from "gatsby-plugin-image";
import React from "react";
import { Border } from "./border";
import { Clock } from "./clock";
import { PostTitle } from "./post-title";
import noImage from "../images/no-image.png";

export const PostCard = ({ date, slug, title, heroImage, heroImageAlt }) => {
  const image = getImage(heroImage);
  const isPortrait = image?.width < image?.height;
  const imageTag = image ? (
    <>
      <meta itemProp="image" content={getSrc(heroImage)} />
      <GatsbyImage
        image={image}
        alt={heroImageAlt}
        className="basis-[56.25%]"
      />
    </>
  ) : (
    <>
      <meta itemProp="image" content={noImage} />
      <StaticImage
        src="../images/no-image.png"
        alt="No hero image"
        className="basis-[56.25%]"
      />
    </>
  );

  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author {
              name
            }
            siteUrl
          }
        }
      }
    `
  );

  return (
    <Link
      to={slug}
      className="overflow-hidden rounded bg-slate-700 hover:bg-sky-400"
    >
      <article
        className={`flex aspect-square h-full w-full min-w-0 ${
          isPortrait ? `flex-row` : `flex-col`
        }`}
        itemScope
        itemType="https://schema.org/BlogPosting"
      >
        {imageTag}
        <header
          className={`flex min-h-0 min-w-0 basis-[43.75%] gap-2 p-2 ${
            isPortrait ? `flex-col` : `flex-row`
          }`}
        >
          <div
            className="hidden"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
          >
            <meta itemProp="name" content={siteMetadata.author?.name} />
            <meta itemProp="url" content={siteMetadata.siteUrl} />
          </div>
          <Clock {...{ date }} />
          <Border />
          <div className="flex content-center overflow-auto">
            {/* Need the wrapper div because `content-center` has an unexpected behavior when overflow. */}
            {/* See [StackOverflow](https://stackoverflow.com/questions/34184535/change-justify-content-value-when-flex-items-overflow-container) . */}
            <div className="my-auto">
              <PostTitle isArticleHeader={true}>{title}</PostTitle>
            </div>
          </div>
        </header>
      </article>
    </Link>
  );
};
