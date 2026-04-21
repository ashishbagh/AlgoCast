// You are given an array of non-overlapping intervals intervals where intervals[i] = [start_i, end_i] represents the start and the end time of the ith interval. intervals is initially sorted in ascending order by start_i.
// You are given another interval newInterval = [start, end].

// Insert newInterval into intervals such that intervals is still sorted in ascending order by start_i and also intervals still does not have any overlapping intervals. You may merge the overlapping intervals if needed.

// Return intervals after adding newInterval.

// Note: Intervals are non-overlapping if they have no common point. For example, [1,2] and [3,4] are non-overlapping, but [1,2] and [2,3] are overlapping.

// Example 1:

// Input: intervals = [[1,3],[4,6]], newInterval = [2,5]

// Output: [[1,6]]

class Solution {
  /**
   * @param {number[][]} intervals
   * @param {number[]} newInterval
   * @return {number[][]}
   */
  insert(intervals, newInterval) {
    let result = [];
    for (let i = 0; i < intervals.length; i++) {
      if (intervals[i][0] > newInterval[1]) {
        result.push(newInterval);
        return [...result, ...intervals.slice(i, intervals.length)];
      } else if (intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
      } else if (intervals[i][1] >= newInterval[0]) {
        newInterval = [
          Math.min(intervals[i][0], newInterval[0]),
          Math.max(intervals[i][1], newInterval[1]),
        ];
      }
    }
    result.push(newInterval);

    return result;
  }
}
