/**
 * @typedef {((...args: Array<unknown>) => void) & {
 *   cancel: () => void,
 *   flush: () => void,
 * }} DebouncedFunction
 */

/**
 * @param {Function} func
 * @param {number} [wait=0]
 * @return {DebouncedFunction}
 */
export default function debounce(func, wait) {
  let timeoutId;
  let data;
  let lastThis;

  const debounce = function (...args) {
    lastThis = this;
    data = args;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      data = undefined;
      lastThis = undefined;
      timeoutId = undefined;
    }, wait);
  };

  debounce.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  debounce.flush = function () {
    if (timeoutId) {
      func.apply(lastThis, data);
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounce;
}
