/**
 * Validate `date` of the post.
 *
 * **Warning** : `date` must be queried with `formatString` . Otherwise, it will not work properly.
 *
 * @param  {string} date - a date string.
 * @param  {string} id - the ID of the post node.
 */
const validateDate = (date, id) => {
  // If invalid `date` is queried without `formatString` , the value of `date` will not be `"Invalid date"` .
  if (date === `Invalid date`) {
    throw new Error(
      [
        `Invalid date!!`,
        `ID: '${id}' .`,
        ``,
        `If you use the '/' as a separator, replace it with hyphens,`,
        `e.g., ❌ '2023/02/11 09:12' => ⭕ '2023-02-11 09:12' .`,
        ``,
        `If you set the hour to 1 digits, set it to 2 digits,`,
        `e.g., ❌ '2023-02-11 9:12' => ⭕ '2023-02-11 09:12' .`,
      ].join(` `)
    );
  }
};

/**
 * Validate `excerpt` of the post.
 *
 * @param  {string} excerpt - a HTML excerpt.
 * @param  {string} id - the ID of the post node.
 */
const validateExcerpt = (excerpt, id) => {
  if (!excerpt) {
    console.warn(`No excerpt!! ID: '${id}' .`);
  }
};

/**
 * Validate `html` of the post.
 *
 * @param  {string} html - a HTML.
 * @param  {string} id - the ID of the post node.
 */
const validateHtml = (html, id) => {
  if (!html) {
    console.warn(`No html!! ID: '${id}' .`);
  }
};

/**
 * Validate `slug` of the post.
 *
 * @param  {string} slug - a slug.
 * @param  {string} id - the ID of the post node.
 */
const validateSlug = (slug, id) => {
  if (!slug) {
    throw new Error(`No slug!! ID: '${id}' .`);
  }
};

/**
 * Validate `tags` of the post.
 *
 * @param  {{name: string, slug: string}[]} tags - a tags.
 * @param  {string} id - the ID of the post node.
 */
const validateTags = (tags, id) => {
  if (!tags?.length) {
    console.warn(`No tags!! ID: '${id}' .`);
  }
};

/**
 * Validate `title` of the post.
 *
 * @param  {string} title - a title.
 * @param  {string} id - the ID of the post node.
 */
const validateTitle = (title, id) => {
  if (!title) {
    console.warn(`No title!! ID: '${id}' .`);
  }
};

module.exports = {
  validateDate,
  validateExcerpt,
  validateHtml,
  validateSlug,
  validateTags,
  validateTitle,
};
