/**
 * @param {Array<*|Array>} value
 * @return {Array}
 */
export default function flatten(value) {
  let result = [];
  const flat = (arr) => {
    if (!arr.length || arr.length === 0) return;
    for (const val of arr) {
      if (typeof val === "object" && val !== null) {
        flat(val);
        continue;
      }
      result.push(val);
    }
  };

  flat(value);

  return result;
}
