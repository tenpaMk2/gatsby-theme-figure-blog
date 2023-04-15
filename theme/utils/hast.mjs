import { visitParents } from "unist-util-visit-parents";

/**
 * Workaround for [issue #34338](https://github.com/gatsbyjs/gatsby/issues/34338)
 *
 * Original code was written by [Ameobea](https://github.com/Ameobea);
 *
 * @param {Object} hast
 * @returns {Object} hast
 */
const patchHast = async (hast) => {
  // There is a funny bug somewhere in one of the dozens-hundreds of libraries being used to transform markdown which
  // is causing a problem with `srcset`.  Images are being converted into HTML in the markdown which automatically
  // references the sources of the generated resized/converted images.  The generated `srcset` prop is being somehow
  // converted into an array of strings before being passed to `rehype-react` which is then concatenating them and
  // generating invalid HTML.
  //
  // This code handles converting `srcset` arrays into valid strings.
  if (hast.properties?.srcSet && Array.isArray(hast.properties.srcSet)) {
    hast.properties.srcSet = hast.properties.srcSet.join(", ");
  }
  if (hast.children) {
    hast.children = await Promise.all(hast.children.map(patchHast));
  }
  return hast;
};

/**
 * A helper function to generate a link card.
 * @param {Object} hast
 * @param {Object} context
 * @returns
 */
const generatePostLinkCard = async (hast, context) => {
  const {
    siteMetadata: { siteUrl },
  } = await context.nodeModel.findOne({
    type: `Site`,
  });

  // Store processing-targets.
  // We can't use async function ( `context.nodeModel.findOne()` ) in the `visitor()` of `visitParents()`
  // because `visitor()` must be non async function.
  // See [unist issues](https://github.com/syntax-tree/unist-util-visit-parents/issues/8#issuecomment-1413405543) .
  const targets = [];

  visitParents(hast, "element", (node, ancestor) => {
    if (ancestor.length !== 1) return;
    if (ancestor[0].type !== `root`) return;
    if (node.tagName !== `p`) return;
    if (node.children.length !== 1) return;
    if (node.children[0].tagName !== `a`) return;
    // Process only if the link is alone and placed at top level.

    const href = node.children[0].properties.href;

    const origin = new URL(siteUrl).origin;
    const url = new URL(href, origin);

    if (url.origin !== origin) {
      return;
    }
    // Process only if this link is internal.

    if (!/^\//.test(href)) {
      return;
    }
    // Process only if this link is root relative URL.

    targets.push({ node, href });
  });

  // Process the targets.
  const promises = targets.map(async ({ node, href }) => {
    // `href` is percent encoded.
    const slug = decodeURI(href);

    const postNode = await context.nodeModel.findOne({
      type: `MarkdownPost`,
      query: {
        filter: { slug: { eq: slug } },
      },
    });
    const pageNode = await context.nodeModel.findOne({
      type: `MarkdownPage`,
      query: {
        filter: { slug: { eq: slug } },
      },
    });

    if (!postNode && !pageNode) return;
    // Process only if post or page node exist.

    node.tagName = `PostLinkCard`; // Sync this name with definitions in `src/libs/hast-to-jsx-runtime.js` .
    node.properties = { slug };
    node.children = [];
  });

  return await Promise.all(promises);
};

/**
 * A helper function to check if the node is a gatsby image node.
 * @param {Object} node - A hast node.
 * @returns {boolean}
 */
const isGatbyImageNode = (node) =>
  node.properties?.className?.includes(`gatsby-resp-image-wrapper`);

/**
 * A helper function to find left or right image information.
 * @param {Object} gatsbyImageNode - A hast node of gatsby image.
 * @param {Object} options
 * @param {boolean} options.isLeft - If true, find left image node. Otherwise, find right image node.
 * @returns {Object} - Attributes of left or right image.
 * @returns {string} return.src - The src attribute of the `<img>` .
 * @returns {string} return.srcSet - The srcSet attribute of the `<source>` .
 * @returns {string} return.alt - The alt attribute of the `<img>` .
 * @returns {string} return.title - The title attribute of the `<img>` .
 * @returns {string} return.maxWidth - The max-width of the gatsby image wrapper.
 * @returns {undefined} return - If the image node is not found.
 */
const findLeftRight = (gatsbyImageNodes, { isLeft = true }) => {
  const regex = isLeft ? /^left/ : /^right/;

  let leftRight;

  for (const gatsbyImageNode of gatsbyImageNodes) {
    visitParents(gatsbyImageNode, "element", (node, ancestors) => {
      if (!regex.test(node.properties?.title)) return;
      if (node.tagName !== `img`) return;

      const siblings = ancestors.slice(-1)[0].children;

      const tryForEachType = (type) => {
        for (const sibling of siblings) {
          if (sibling.properties?.type !== type) continue;

          const gatsbyRespImageWrapper = ancestors
            .filter((ancestor) =>
              ancestor.properties.className?.includes(
                `gatsby-resp-image-wrapper`
              )
            )
            .slice(-1)[0];
          const maxWidth = gatsbyRespImageWrapper?.properties?.style
            ?.split(`max-width:`)
            ?.slice(-1)?.[0]
            ?.replaceAll(`;`, ``)
            ?.trim();

          leftRight = {
            src: node.properties.src,
            srcSet: sibling.properties.srcSet,
            alt: node.properties.alt,
            title: node.properties.title,
            maxWidth,
          };
        }
      };

      tryForEachType(`image/jpeg`);
      tryForEachType(`image/webp`); // WebP is the highest priority.
    });
  }

  return leftRight;
};

/**
 * A helper function to generate a slider of left and right images.
 * @param {Object} hast
 * @returns
 */
const generateImageCompareSlider = async (hast) => {
  const targets = [];

  visitParents(hast, "element", (node, ancestor) => {
    if (node.tagName !== `p`) return;
    if (ancestor.length !== 1) return;
    if (ancestor[0].type !== `root`) return;
    // Process only if the p is alone and placed at top level.

    // Find the first and last gatsby image node.
    const firstGatsbyImageNodeIndex = node.children.findIndex((node) =>
      isGatbyImageNode(node)
    );
    const lastGatsbyImageNodeIndex = node.children.findLastIndex((node) =>
      isGatbyImageNode(node)
    );

    // Temporary save the nodes before and after the gatsby image nodes.
    const preNodes = node.children.slice(0, firstGatsbyImageNodeIndex);
    const postNodes = node.children.slice(lastGatsbyImageNodeIndex + 1);

    // Get the gatsby image nodes.
    const imageNodes = node.children.filter((node) => isGatbyImageNode(node));

    const left = findLeftRight(imageNodes, { isLeft: true });
    const right = findLeftRight(imageNodes, { isLeft: false });

    if (left && right) {
      targets.push({ node, preNodes, left, right, postNodes });
    }
  });

  // Process the targets.
  const promises = targets.map(
    async ({ node, preNodes, left, right, postNodes }) => {
      node.type = `element`;
      node.tagName = `div`;
      node.properties = {};
      node.children = [
        ...preNodes,
        {
          type: `element`,
          tagName: `ImageCompareSlider`,
          properties: { left, right },
          children: [],
        },
        ...postNodes,
      ];
    }
  );

  return await Promise.all(promises);
};

/**
 * Customize hast.
 * See also [hast-to-jsx-runtime](./src/libs/hast-to-jsx-runtime.js) .
 * @param {Object} hast - HTML AST. See [syntax-tree](https://github.com/syntax-tree) .
 * @param {Object} context - `context` of the argument of resolver.
 */
export const customizeHast = async (hast, context) => {
  await patchHast(hast);
  await generatePostLinkCard(hast, context);
  await generateImageCompareSlider(hast);
};
