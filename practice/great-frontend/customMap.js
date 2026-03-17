// Array.prototype.map creates a new array populated with the results of calling a provided function on every element in the calling array.

// Implement Array.prototype.map. To avoid overwriting the actual Array.prototype.map which is being used by the autograder, we shall instead implement it as Array.prototype.myMap.

// Examples

// [1, 2, 3, 4].myMap((i) => i); // [1, 2, 3, 4]
// [1, 2, 3, 4].myMap((i) => i * i); // [1, 4, 9, 16]

/**
 * @template T, U
 * @param { (value: T, index: number, array: Array<T>) => U } callbackFn
 * @param {any} [thisArg]
 * @return {Array<U>}
 */
Array.prototype.myMap = function (callbackFn, thisArg) {
  let result = [];
  if (Array.isArray(this)) {
    let arr = this;
    result = new Array(arr.length); // preserve length
    for (let i = 0; i < arr.length; i++) {
      if (i in arr) {
        result[i] = callbackFn.call(thisArg, arr[i], i, arr);
      }
    }
  }
  return result;
};
