import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { jsxDEV } from "react/jsx-dev-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { PostLinkCard } from "../components/post-link-card";

/**
 * Components options for Figure blog theme.
 * See [hast-util-to-jsx-runtime doc](https://github.com/syntax-tree/hast-util-to-jsx-runtime#components)
 */
const components = { PostLinkCard };

const options = {
  Fragment,
  jsx,
  jsxs,
  jsxDEV,
  components,
};

export const hastToReactComponents = (hast) => toJsxRuntime(hast, options);
