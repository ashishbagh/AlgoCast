/**
 * @param {*} value
 * @returns Promise
 */
export default function promiseResolve(value) {
  let isPromise = value instanceof Promise;
  if (isPromise) return value;
  let isThenable = typeof value.then === "function";
  if (isThenable) {
    return new Promise(value.then.bind(value));
  }

  return new Promise(function (resolve) {
    resolve(value);
  });
}
