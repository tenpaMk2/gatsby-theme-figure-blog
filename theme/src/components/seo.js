import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { addTrailingSlash } from "../libs/add-trailing-slash";
import noImage from "../images/no-image.png";

const Seo = ({
  applicationName,
  canonicalUrl,
  description,
  imagePath,
  pathname,
  title,
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
            locale
          }
        }
      }
    `
  );

  const url = new URL(siteMetadata.siteUrl);
  url.pathname = pathname || ``;

  const imageUrl = new URL(siteMetadata.siteUrl);
  imageUrl.pathname = imagePath || noImage;

  const seo = {
    htmlLang: siteMetadata.locale,
    title: title ? `${title} | ${siteMetadata.title}` : siteMetadata.title,
    applicationName: applicationName || ``,
    author: siteMetadata.author?.name || ``,
    description: description || siteMetadata.description,
    url: addTrailingSlash(`${url.origin}${url.pathname}`),
    imageUrl: addTrailingSlash(`${imageUrl.origin}${imageUrl.pathname}`),
    ogType: url.pathname === `/` ? `website` : `article`,
    ogLocale: siteMetadata.locale || ``,
    twitter: siteMetadata.social?.twitter || ``,
    canonicalUrl:
      canonicalUrl || addTrailingSlash(`${url.origin}${url.pathname}`),
  };

  const tag = {
    applicationName: seo.applicationName ? (
      <meta name="application-name" content={seo.applicationName} />
    ) : null,
    canonicalUrl: seo.canonicalUrl ? (
      <link rel="canonical" href={seo.canonicalUrl} />
    ) : null,
  };

  return (
    <>
      {/* Gatsby Head API: Editing `<html>` and `<body>` : <https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/#editing-html-and-body> */}
      <html lang={seo.htmlLang} />

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
      <meta property="og:image:alt" content={seo.description} />
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:locale" content={seo.ogLocale} />

      {/* twitter doc: <https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seo.twitter} />
      <meta name="twitter:creator" content={seo.twitter} />

      <meta name="gatsby-theme" content="@tenpamk2/gatsby-theme-figure-blog" />

      <link rel="icon" sizes="16x16" href="/favicon.ico" />

      {tag.canonicalUrl}

      {children}
    </>
  );
};

export { Seo };
