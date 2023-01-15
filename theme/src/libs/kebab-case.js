/**
 * This is my custom `kebabCase()` .
 * Original source code is written by Jon Schlinkert.
 * <https://github.com/jonschlinkert/dashify/blob/master/index.js>
 */

/**
 * This is my custom `kebabCase()` .
 *
 * Converts following characters to `-` .
 *
 * - Reserved characters in RFC3986
 * - Not mentioned characters in RFC3986 under `U+000080`
 *   - "Not mentioned" means neigher "reserved" or "unreserved" .
 *
 * NOT convert following characters to `-` .
 *
 * - Unicode character over `U+00007F`
 *   - including CJK Kanji, fullwidth latin, and fullwidth digit
 *
 * Remove following characters.
 *
 * - ASCII control code
 *
 * Trim `-` from both ends.
 * Reduces consecutive `-` to a single `-` .
 * Convert all uppercase characters to lowercase.
 *
 * example1:
 *
 * ```js
 * "---A B!C\"D#E$F%G&H'I(J)K*L+M,N-O.P/Q:R;S<T=U>V?W@X[Y\\Z]a^b_c`d{e|f}g~h日本語ＡＢＣ１２３　４５６ほ*?:げ---"
 * // output: 'a-b-c-d-e-f-g-h-i-j-k-l-m-n-o.p-q-r-s-t-u-v-w-x-y-z-a-b_c-d-e-f-g~h日本語ａｂｃ１２３　４５６ほ-げ'
 * ```
 *
 * @param  {string} str - string.
 * @returns {string} converted result.
 */
const kebabCase = (str) => {
  if (typeof str !== `string`) throw new TypeError(`str must be string.`);
  return str
    .replace(/[ !"#$%&'()*+,/:;<=>?@\[\\\]^`{|}]/g, `-`)
    .replace(/[\u0000-\u001F\u007F]/g, ``)
    .replace(/^-+|-+$/g, ``)
    .replace(/-{2,}/g, `-`)
    .toLowerCase();
};

module.exports = {
  kebabCase,
};
