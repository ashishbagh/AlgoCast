// Given an array arr[] containing both positive and negative integers, the task is to find the length of the longest subarray with a sum equals to 0.

// Note: A subarray is a contiguous part of an array, formed by selecting one or more consecutive elements while maintaining their original order.
// Examples:

// Input: arr[] = [15, -2, 2, -8, 1, 7, 10, 23]
// Output: 5
// Explanation: The longest subarray with sum equals to 0 is [-2, 2, -8, 1, 7].
// Input: arr[] = [2, 10, 4]
// Output: 0
// Explanation: There is no subarray with a sum of 0.
// Input: arr[] = [1, 0, -4, 3, 1, 0]
// Output: 5
// Explanation: The longest subarray with sum equals to 0 is [0, -4, 3, 1, 0]

const longestSub = (arr) => {
  let map = new Map();
  let prefix = 0;
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    prefix += arr[i];

    if (!map.has(prefix)) {
      map.set(prefix, i);
    } else {
      const storedIndex = map.get(prefix);
      const len = i - storedIndex;
      count = Math.max(count, len);
    }
  }

  return count;
};

console.log(longestSub([15, -2, 2, -8, 1, 7, 10, 23]));
console.log(longestSub([2, 10, 4]));
console.log(longestSub([1, 0, -4, 3, 1, 0]));
