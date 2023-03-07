/**
 * Convert excerpt AST of remark to description for RSS.
 *
 * Ignore text inside the following tags.
 *
 * - `<ul>`
 * - `<li>`
 * - `<pre>`
 * - `<table>`
 *
 * (Unlike the `excerpt` of remark, texts inside `<code>` are not ignored.)
 *
 * @param  {Object} ast - The AST of MarkdownRemark node.
 * @returns {string} The description for RSS.
 */
const excerptASTToDescription = (ast) => {
  const recursive = (leaf) => {
    if ([`ul`, `li`, `pre`, `table`].includes(leaf.tagName)) {
      return null;
    }

    const result = leaf.children
      ? leaf.children.map((child) => recursive(child)).join(``)
      : leaf.value;

    const wrapper = leaf.tagName === `code` ? "`" : ``;

    return `${wrapper}${result}${wrapper}`;
  };

  // Convert line breaks to spaces.
  // Convert consecutive spaces to single space.
  return recursive(ast)
    .replace(/(\r\n|\n|\r)/gm, ` `)
    .replace(/  +/g, ` `);
};

module.exports = {
  excerptASTToDescription,
};
