/**
 * @param {Object} obj
 * @return {Object}
 */
export default function squashObject(obj) {
  const result = {};

  function dfs(value, path = "") {
    for (const [key, child] of Object.entries(value)) {
      const nextPath = key ? (path ? `${path}.${key}` : key) : path;

      if (child !== null && typeof child === "object") {
        dfs(child, nextPath);
      } else {
        result[nextPath] = child;
      }
    }
  }

  dfs(obj);
  return result;
}
