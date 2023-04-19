/**
 * Remove undefined values from an object.
 *
 * @param {Object} obj - Object to remove undefined values from.
 * @returns {Object} Object without undefined values.
 */
export const removeUndefined = (obj) => {
  const result = {};

  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) continue;
    result[key] = obj[key];
  }

  return result;
};
