/**
 * Get month name from month-number.
 *
 * ex1:
 *
 * ```js
 * getMonthName(1)
 * // output: "Jan"
 * ```
 *
 * @param  {number} monthNumber - number from 1 to 12.
 * @returns {string} short month name.
 */
export const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  // TODO: use locale config.
  return date.toLocaleString(`en-US`, {
    month: `short`,
  });
};
