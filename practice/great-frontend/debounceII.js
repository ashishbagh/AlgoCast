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

  function debounced(...args) {
    lastThis = this;
    data = args;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(lastThis, data);
      timeoutId = undefined;
      data = undefined;
      lastThis = undefined;
    }, wait);
  }

  debounced.cancel = function () {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  }.bind(this);

  debounced.flush = function (...args) {
    if (timeoutId === undefined) return;
    func.apply(lastThis, data);
    clearTimeout(timeoutId);
    timeoutId = undefined;
  }.bind(this);

  return debounced;
}
