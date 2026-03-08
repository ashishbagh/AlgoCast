/**
 * @template T
 * @param {T} value
 * @return {T}
 */
export default function deepClone(value, result = {}) {
  if (typeof value !== "object") return value;
  if (!value) return value;

  let keys = Object.keys(value);

  for (const key of keys) {
    switch (typeof value[key]) {
      case "object":
        if (!value[key].length) result[key] = deepClone(value[key], {});
        result[key] = deepClone(value[key], []);
        break;
      default:
        result[key] = value[key];
        break;
    }
  }
  return result;
}
