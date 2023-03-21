/**
 * Validate `date` of the post.
 *
 * **Warning** : `date` must be queried with `formatString` . Otherwise, it will not work properly.
 *
 * @param  {string} date - a date string.
 * @param  {string} id - the ID of the post node.
 */
export const validateDate = (date, id) => {
  if (!date) {
    console.warn(`No date!! ID: '${id}' .`);
  }

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
