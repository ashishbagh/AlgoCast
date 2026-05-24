// You are given a 2D integer array intervals, where intervals[i] = [left_i, right_i] represents the ith interval starting at left_i and ending at right_i (inclusive).
// You are also given an integer array of query points queries. The result of query[j] is the length of the shortest interval i such that left_i <= queries[j] <= right_i. If no such interval exists, the result of this query is -1.
// Return an array output where output[j] is the result of query[j].
// Note: The length of an interval is calculated as right_i - left_i + 1.

// Example 1:
// Input: intervals = [[1,3],[2,3],[3,7],[6,6]], queries = [2,3,1,7,6,8]

// Output: [2,2,3,5,1,-1]

class Solution {
  /**
   * @param {number[][]} intervals
   * @param {number[]} queries
   * @return {number[]}
   */
  minInterval(intervals, queries) {
    intervals = intervals.sort((a, b) => a[0] - b[0]);
    let result = new Array(queries.length).fill(Infinity);
    let i = 0;
    for (const query of queries) {
      for (const [start, end] of intervals) {
        if (start <= query && query <= end) {
          let res = end - start + 1;
          result[i] = Math.min(result[i], res);
        }
      }
      if (result[i] === Infinity) result[i] = -1;
      i++;
    }

    return result;
  }
}
