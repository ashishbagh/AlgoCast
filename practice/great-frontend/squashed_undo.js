/**
 * @param {Object} obj
 * @return {Object}
 */
export default function unsquashObject(obj) {
  let result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key.split(".").length > 0) {
      build(key.split(".").filter(Boolean), result, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

const build = (keys, current, value) => {
  const key = keys.shift();
  if (key === undefined) return;

  if (key === "") {
    return build(keys, current, value);
  }

  if (keys.length === 0) {
    current[key] = value;
    return;
  }

  const nextKey = keys[0];
  const nextIsIndex = !Number.isNaN(Number(nextKey));

  if (!current[key]) {
    current[key] = nextIsIndex ? [] : {};
  }

  build(keys, current[key], value);
};
