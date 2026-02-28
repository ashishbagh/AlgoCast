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
  let sortedInt = intervals.sort((a, b) => a[0] - b[0]);

  let result = [sortedInt[0]];
  let respointer = 1;

  let pointer = 1;
  while (pointer < sortedInt.length) {
    // over lapping
    if (result[respointer - 1][1] >= sortedInt[pointer][0]) {
      // Check which interval will be at the end
      let end = Math.max(sortedInt[pointer][1], result[respointer - 1][1]);
      result[respointer - 1] = [result[respointer - 1][0], end];
    } else {
      result.push(sortedInt[pointer]);
      respointer++;
    }
    pointer++;
  }

  return result;
};
