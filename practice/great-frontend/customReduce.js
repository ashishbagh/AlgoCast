// Array.prototype.reduce is a way of "reducing" elements in an array by calling a "reducer" callback function on each element of the array in order, passing in the return value from the calculation on the preceding element. The final result of running the reducer across all elements of the array is a single value.
// Implement Array.prototype.reduce. To avoid overwriting the actual Array.prototype.reduce which is being used by the autograder, we shall instead implement it as Array.prototype.myReduce.

// Examples

// [1, 2, 3].myReduce((prev, curr) => prev + curr, 0); // 6
// [1, 2, 3].myReduce((prev, curr) => prev + curr, 4); // 10

/**
 * @template T, U
 * @param {(previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U} callbackFn
 * @param {U} [initialValue]
 * @return {U}
 */
Array.prototype.myReduce = function (callbackFn, initialValue) {
  let arr = this;
  if (arr.length === 0 && initialValue === 0) return 0;
  if (arr.length === 0) throw "empty array";
  let accumulator = initialValue === undefined ? 0 : initialValue;
  for (let i = 0; i < arr.length; i++) {
    if (!(i in arr)) continue;
    accumulator = callbackFn(accumulator, arr[i], i, arr);
  }
  return accumulator;
};
