// Given an array of intervals intervals where intervals[i] = [start_i, end_i], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.
// Note: Intervals are non-overlapping even if they have a common point. For example, [1, 3] and [2, 4] are overlapping, but [1, 2] and [2, 3] are non-overlapping.
// Example 1:
// Input: intervals = [[1,2],[2,4],[1,4]]
// Output: 1
// Explanation: After [1,4] is removed, the rest of the intervals are non-overlapping.

// Example 2:
// Input: intervals = [[1,2],[2,4]]
// Output: 0

class Solution {
  /**
   * @param {number[][]} intervals
   * @return {number}
   */
  eraseOverlapIntervals(intervals) {
    let sortedIn = intervals.sort((a, b) => a[0] - b[0]);
    let prevEnd = sortedIn[0][1];
    let res = 0;

    for (let i = 1; i < sortedIn.length; i++) {
      let start = sortedIn[i][0];
      let end = sortedIn[i][1];
      if (start >= prevEnd) {
        prevEnd = end;
      } else {
        res += 1;
        prevEnd = Math.min(end, prevEnd);
      }
    }

    return res;
  }
}
