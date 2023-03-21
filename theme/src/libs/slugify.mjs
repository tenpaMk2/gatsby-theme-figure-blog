import { kebabCase } from "./kebab-case.mjs";

/**
 * This is my custom `slugify()` .
 * Reserved characters in RFC3986 are converted to `-` .
 *
 * example1:
 *
 * ```js
 * slugify(`dir`);
 * // output: '/dir/'
 * ```
 *
 * example2:
 *
 * ```js
 * slugify(`dir1`, `DIR2/`, `/dir3/`, `/日本語　ＡＢＣ１２３`);
 * // output: '/dir1/dir2/dir3/日本語　ａｂｃ１２３/'
 * ```
 *
 * example3:
 *
 * ```js
 * slugify("---A B!C\"D#E$F%G&H'I(J)K*L+M,N-O.P/Q:R;S<T=U>V?W@X[Y\\Z]a^b_c`d{e|f}g~h日本語ＡＢＣ１２３　４５６ほ*?:げ---");
 * // output: '/a-b-c-d-e-f-g-h-i-j-k-l-m-n-o.p-q-r-s-t-u-v-w-x-y-z-a-b_c-d-e-f-g~h日本語ａｂｃ１２３　４５６ほ-げ/'
 * ```
 *
 * @see {@link ./kebab-case.js}
 *
 * @param  {...string} dirs - directory names.
 * @returns {string} URL that begins and ends with `/` .
 */
export const slugify = (...dirs) => {
  const validDirs = dirs.filter((dir) => dir?.toString);
  const url = validDirs.map((dir) => kebabCase(dir.toString())).join(`/`);
  return `/${url}/`.replace(/\/\/+/g, `/`);
};
