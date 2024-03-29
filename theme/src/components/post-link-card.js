import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import { PostTitle } from "./post-title";

export const PostLinkCard = ({ slug }) => {
  const {
    allMarkdownPost: { nodes: posts },
    allMarkdownPage: { nodes: pages },
  } = useStaticQuery(
    graphql`
      query {
        allMarkdownPost {
          nodes {
            heroImage {
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH)
              }
            }
            heroImageAlt
            slug
            title
          }
        }
        allMarkdownPage {
          nodes {
            heroImage {
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH)
              }
            }
            heroImageAlt
            slug
            title
          }
        }
      }
    `
  );

  const linked =
    posts.filter((node) => node.slug === slug)?.[0] ??
    pages.filter((node) => node.slug === slug)?.[0];
  const image = getImage(linked?.heroImage);

  const imageTag = image ? (
    <GatsbyImage
      image={image}
      alt={linked?.heroImageAlt}
      style={{ maxWidth: `${image.width < image.height ? 90 : 180}px` }}
      className="isolate basis-full" // `isolate` is needed to work around [iOS bug](https://gotohayato.com/content/556/) .
    />
  ) : (
    <StaticImage
      src="../images/no-image.png"
      layout="fullWidth"
      alt="The linked post has no image."
      style={{ maxWidth: `180px` }}
      className="isolate basis-full" // `isolate` is needed to work around [iOS bug](https://gotohayato.com/content/556/) .
    />
  );

  const title = linked?.title ?? `No title post`;
  return (
    <div className="my-4">
      <Link
        to={slug}
        className="group block overflow-hidden rounded-lg border-2 border-sky-400 bg-sky-500 no-underline hover:bg-sky-400"
      >
        <div className="flex group-hover:bg-sky-400">
          {imageTag}
          <div className="flex p-4">
            <PostTitle isArticleHeader={false}>{title}</PostTitle>
          </div>
        </div>
      </Link>
    </div>
  );
};
