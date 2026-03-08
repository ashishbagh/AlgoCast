/**
 * @param {Function} func
 * @returns Function
 */
export default function memoize(func) {
  let cache = new Map();
  return function (...args) {
    let key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    let result = func.call(this, ...args);
    cache.set(key, result);
    return result;
  };
  throw "Not implemented";
}

let count = 0;
// function mul(this, x) {
//   count++;
//   return this.age * x;
// };
// const person = {
//   age: 42,
//   mul: memoize(mul),
// };
function double(x) {
  count++;
  return x + x;
}
const memoizedFn = memoize(double);
console.log(memoizedFn("bar"));
