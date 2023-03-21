/**
 * Add trailing slash to input string.
 *
 * example1:
 *
 * ```js
 * addTrailingSlash(`http://example.com/hoge`);
 * // output: 'http://example.com/hoge/'
 * ```
 *
 * example2:
 *
 * ```js
 * addTrailingSlash(`http://example.com/hoge/`);
 * // output: 'http://example.com/hoge/'
 * ```
 *
 * example3:
 *
 * ```js
 * addTrailingSlash(`http://example.com/hoge//`);
 * // output: 'http://example.com/hoge/'
 * ```
 *
 * @param  {string} str - string.
 * @returns {string} The string ending in a single `/` .
 */
export const addTrailingSlash = (str) => {
  if (typeof str !== `string`) throw new TypeError(`str must be string.`);
  return `${str}/`.replace(/\/+$/, `/`);
};
