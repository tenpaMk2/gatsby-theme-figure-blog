import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * The acceptable CSS properties for RSS feed.
 * See [W3C Validation Service](https://validator.w3.org/feed/docs/warning/DangerousStyleAttr.html) .
 */
const acceptableCSSProperties = [
  "azimuth",
  "background",
  "background-color",
  "border",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-style",
  "border-top-width",
  "border-width",
  "clear",
  "color",
  "cursor",
  "direction",
  "display",
  "elevation",
  "float",
  "font",
  "font-family",
  "font-size",
  "font-style",
  "font-variant",
  "font-weight",
  "height",
  "letter-spacing",
  "line-height",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "overflow",
  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "pause",
  "pause-after",
  "pause-before",
  "pitch",
  "pitch-range",
  "richness",
  "speak",
  "speak-header",
  "speak-numeral",
  "speak-punctuation",
  "speech-rate",
  "stress",
  "text-align",
  "text-decoration",
  "text-indent",
  "unicode-bidi",
  "vertical-align",
  "voice-family",
  "volume",
  "white-space",
  "width",
];

/**
 * Convert kebab-case to lowerCamelCase.
 *
 * @param  {string} kebab - The kebab-case string.
 * @returns {string} The lowerCamelCase string.
 */
const kebabToCamel = (kebab) => kebab.replace(/-./g, (x) => x[1].toUpperCase());

/**
 * Convert any url to a full URL that is percent-encoded.
 *
 * examples:
 *
 * - `urlToFullUrl('//google.com', 'https://example.com/foo/')` returns `'https://google.com'` .
 * - `urlToFullUrl(`ほげ/ふが/`, `https://example.com/foo/`)` returns `'https://example.com/foo/%E3%81%BB%E3%81%92/%E3%81%B5%E3%81%8C/'` .
 * - `urlToFullUrl(`%E3%81%BB%E3%81%92/`, `https://example.com/foo/`)` returns `'https://example.com/foo/%E3%81%BB%E3%81%92/'` .
 * - `urlToFullUrl('bar', 'https://example.com/foo/')` returns `'http://example.com/foo/bar'` .
 * - `urlToFullUrl('../bar', 'https://example.com/foo/')` returns `'http://example.com/bar'` .
 * - `urlToFullUrl('/bar', 'https://example.com/foo/')` returns `'http://example.com/bar'` .
 * - `urlToFullUrl('bar/', 'https://example.com/foo/')` returns `'http://example.com/bar/'` .
 * - `urlToFullUrl('#bar', 'https://example.com/foo/')` returns `'http://example.com/foo#bar'` .
 * - `urlToFullUrl('https://google.com', 'https://example.com/foo/')` returns `'https://google.com'` .
 * - `urlToFullUrl('mailto:foo.bar@gmail.com', 'https://example.com/foo/')` returns `'mailto:foo.bar@gmail.com'` .
 * - `urlToFullUrl('javascript:', 'https://example.com/foo/')` returns `'javascript:'` .
 *
 * @param  {string} url - The URL such as `http://example.com` , `foo` , `/foo` or `#bar` .
 * @param  {string} baseUrl - The base URL. It must end with `/` if it contains directories.
 * @returns {string} The full URL such as 'https://example.com/foo/#bar' .
 */
const urlToFullUrl = (url, baseUrl) => new URL(url, baseUrl).href;

/**
 * Convert AST of remark excerpt to `<content:encoded>` for RSS.
 *
 * @param  {Object} ast - The AST of MarkdownRemark node.
 * @param  {string} baseUrl - The base URL. It must end with `/` if it contains directories.
 * @returns {string} The text for `<content:encoded>` for RSS.
 */
export const hastToContentEncoded = (ast, baseUrl) => {
  const recursive = (leaf) => {
    if (
      leaf.properties?.className?.includes(`gatsby-resp-image-background-image`)
    ) {
      // Ignore background placeholder image.
      return null;
    }

    if (leaf.type === `comment`) {
      // Ignore comment.
      return null;
    }

    const children = leaf.children?.map((c) => recursive(c)) || [leaf.value];

    if (leaf.properties?.className?.includes(`gatsby-resp-image-wrapper`)) {
      // Skip.
      return createElement(Fragment, {}, ...children);
    }

    if (leaf.properties?.className) {
      // `className` is array, so it need to be joined.
      leaf.properties.className = leaf.properties.className.join(` `);
    }

    if (leaf.properties?.style) {
      // Decompose style text to each property and value.
      const csss = leaf.properties.style.split(`;`).map((css) => {
        const [property, value] = css.split(`:`).map((s) => s.trim());
        return { property, value };
      });

      // Filter only what are acceptable.
      const acceptables = csss.filter(({ property }) =>
        acceptableCSSProperties.includes(property)
      );

      // Convert property and value to React style object.
      const reactStyleObj = acceptables.reduce(
        (x, { property, value }) => ({
          ...x,
          [kebabToCamel(property)]: value,
        }),
        {}
      );

      leaf.properties.style = reactStyleObj;
    }

    if (leaf.properties?.dataLanguage) {
      // Rename `dataLanguage` to `data-language` .
      leaf.properties[`data-language`] = leaf.properties.dataLanguage;
      delete leaf.properties.dataLanguage;
    }

    if (leaf.properties?.href) {
      // Convert any URL to full URL.
      leaf.properties.href = urlToFullUrl(leaf.properties.href, baseUrl);
    }

    if (leaf.properties?.src) {
      // Convert any URL to full URL.
      leaf.properties.src = urlToFullUrl(leaf.properties.src, baseUrl);
    }

    if (leaf.properties?.srcSet) {
      // Convert any URL to full URL.
      leaf.properties.srcSet = leaf.properties.srcSet.map((str) => {
        const [src, breakpoint] = str.split(` `);
        return `${urlToFullUrl(src, baseUrl)} ${breakpoint}`;
      });
    }

    return createElement(
      leaf.tagName || Fragment,
      leaf.tagName ? leaf.properties : {},
      ...children
    );
  };

  return renderToStaticMarkup(recursive(ast));
};
