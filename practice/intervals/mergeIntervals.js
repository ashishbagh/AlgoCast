// Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

// You may return the answer in any order.

// Note: Intervals are non-overlapping if they have no common point. For example, [1, 2] and [3, 4] are non-overlapping, but [1, 2] and [2, 3] are overlapping.

// Example 1:

// Input: intervals = [[1,3],[1,5],[6,7]]

// Output: [[1,5],[6,7]]

const merge = (intervals) => {
  if (intervals.length < 2) {
    return intervals;
  }
  let int = intervals.sort((a, b) => a[0] - b[0]);
  let result = [int[0]];
  let res = 0;
  for (let i = 1; i < int.length; i++) {
    if (result[res][1] >= int[i][0]) {
      result[res] = [
        Math.min(result[res][0], int[i][0]),
        Math.max(result[res][1], int[i][1]),
      ];
    } else {
      result.push(int[i]);
      res++;
    }
  }

  return result;
};
