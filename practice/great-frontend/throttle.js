/**
 * @callback func
 * @param {number} wait
 * @return {Function}
 */
export default function throttle(func, wait) {
  let cache = new Map();
  cache.set("isThrottle", false);
  return function (...args) {
    if (!cache.get("isThrottle")) {
      const result = func.apply(this, args);
      cache.set("isThrottle", true);
      setTimeout(() => cache.set("isThrottle", false), wait);
      return result;
    }
  };
}
