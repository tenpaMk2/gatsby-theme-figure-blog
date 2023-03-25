import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { jsxDEV } from "react/jsx-dev-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { PostLinkCard } from "../components/post-link-card";
import { ImageCompareSlider } from "../components/image-compare-slider";

/**
 * Components options for Figure blog theme.
 * See [hast-util-to-jsx-runtime doc](https://github.com/syntax-tree/hast-util-to-jsx-runtime#components)
 */
const components = { PostLinkCard, ImageCompareSlider };

/** Options for `toJsxRuntime()` . */
const options = {
  Fragment,
  jsx,
  jsxs,
  jsxDEV,
  components,
};

/**
 * Convert HTML AST to React components.
 * @param {Object} hast - HTML AST.
 * @returns {Object} React components.
 */
export const hastToReactComponents = (hast) => toJsxRuntime(hast, options);
