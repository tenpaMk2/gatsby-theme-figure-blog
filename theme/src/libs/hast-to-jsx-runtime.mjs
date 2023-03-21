import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { jsxDEV } from "react/jsx-dev-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { PostLinkCard } from "../components/post-link-card";

/**
 * Components options for Figure blog theme.
 * See [hast-util-to-jsx-runtime doc](https://github.com/syntax-tree/hast-util-to-jsx-runtime#components)
 */
const components = { PostLinkCard };

/** Options for `toJsxRuntime()` . */
const options = {
  Fragment,
  jsx,
  jsxs,
  jsxDEV,
  components,
};

/**
 * Workaround for [issue #34338](https://github.com/gatsbyjs/gatsby/issues/34338)
 *
 * Original code is written by [Ameobea](https://github.com/Ameobea);
 *
 * @param {Object} ast
 * @returns {Object}
 */
const patchHTMLAST = (ast) => {
  // There is a funny bug somewhere in one of the dozens-hundreds of libraries being used to transform markdown which
  // is causing a problem with `srcset`.  Images are being converted into HTML in the markdown which automatically
  // references the sources of the generated resized/converted images.  The generated `srcset` prop is being somehow
  // converted into an array of strings before being passed to `rehype-react` which is then concatenating them and
  // generating invalid HTML.
  //
  // This code handles converting `srcset` arrays into valid strings.
  if (ast.properties?.srcSet && Array.isArray(ast.properties.srcSet)) {
    ast.properties.srcSet = ast.properties.srcSet.join(", ");
  }
  if (ast.children) {
    ast.children = ast.children.map(patchHTMLAST);
  }
  return ast;
};

/**
 * Convert HTML AST to React components.
 * @param {Object} hast - HTML AST.
 * @returns {Object} React components.
 */
export const hastToReactComponents = (hast) => {
  const patchedHast = patchHTMLAST(hast);
  return toJsxRuntime(patchedHast, options);
};
