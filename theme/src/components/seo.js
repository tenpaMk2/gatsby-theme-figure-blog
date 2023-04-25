import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import noImage from "../images/no-image.png";
import { queryBlogConfig } from "../libs/query-blog-config.mjs";

const addTrailingSlash = (pathname) =>
  /\/$/.test(pathname) ? pathname : `${pathname}/`;

const Seo = ({
  applicationName = ``,
  canonicalUrl = ``,
  description = ``,
  image: {
    src: imageSrc,
    width: imageWidth,
    height: imageHeight,
    alt: imageAlt,
  } = {
    src: noImage,
    width: 800,
    height: 450,
    alt: `no image`,
  },
  isNSFW = false,
  pathname,
  title = ``,
  children,
}) => {
  if (pathname === undefined) {
    throw new Error("`pathname` is undefined. It must be set!!");
  }

  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            author {
              name
              summary
            }
            social {
              twitter
            }
          }
        }
      }
    `
  );

  const { locale } = queryBlogConfig();

  const url = new URL(addTrailingSlash(pathname), siteMetadata.siteUrl);

  const seoOverride = {};
  if (title) seoOverride.title = `${title} | ${siteMetadata.title}`;
  if (description) seoOverride.description = description;
  if (siteMetadata.social?.twitter)
    seoOverride.twitter = siteMetadata.social.twitter;
  if (canonicalUrl) seoOverride.canonicalUrl = canonicalUrl;
  if (url.pathname === `/`) seoOverride.ogType = `website`;

  const seo = {
    ...{
      htmlLang: locale,
      title: siteMetadata.title,
      applicationName,
      author: siteMetadata.author.name,
      description: siteMetadata.description,
      url: url.href,
      imageUrl: new URL(imageSrc, siteMetadata.siteUrl).href,
      imageWidth,
      imageHeight,
      imageAlt,
      isNSFW,
      ogType: `article`,
      ogLocale: locale,
      twitter: ``,
      canonicalUrl: url.href,
    },
    ...seoOverride,
  };

  const tag = {
    applicationName: seo.applicationName ? (
      <meta name="application-name" content={seo.applicationName} />
    ) : null,
    canonicalUrl: seo.canonicalUrl ? (
      <link rel="canonical" href={seo.canonicalUrl} />
    ) : null,
    rating: seo.isNSFW ? <meta name="rating" content="adult" /> : null,
  };

  return (
    <>
      {/* Gatsby Head API: Editing `<html>` and `<body>` : <https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/#editing-html-and-body> */}
      <html lang={seo.htmlLang} />

      {/* Stop scrolling when hamburger menu is active. */}
      <body className="md:!overflow-visible [&:has(#hamburger:checked)]:overflow-hidden" />

      <title>{seo.title}</title>

      {/* MDN doc: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name> */}
      {tag.applicationName}
      <meta name="author" content={seo.author} />
      <meta name="description" content={seo.description} />
      <meta name="generator" content="gatsby" />

      {/* `keywords` are not necessary. See [Google's blog](https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag) . */}

      {/* Facebook doc: <https://developers.facebook.com/docs/sharing/webmasters/> */}
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.imageUrl} />
      <meta property="og:image:alt" content={seo.imageAlt} />
      <meta property="og:image:height" content={seo.imageHeight} />
      <meta property="og:image:width" content={seo.imageWidth} />
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:locale" content={seo.ogLocale} />

      {/* twitter doc: <https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seo.twitter} />
      <meta name="twitter:creator" content={seo.twitter} />

      <meta name="gatsby-theme" content="@tenpamk2/gatsby-theme-figure-blog" />

      {/* See [Google doc](https://developers.google.com/search/docs/crawling-indexing/safesearch) . */}
      {tag.rating}

      {/* See [Google doc](https://support.google.com/programmable-search/answer/1626955) */}
      <meta name="thumbnail" content={seo.imageUrl} />

      {tag.canonicalUrl}

      {children}
    </>
  );
};

export { Seo };
