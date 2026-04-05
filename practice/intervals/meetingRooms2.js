// Given an array of meeting time interval objects consisting of start and end times [[start_1,end_1],[start_2,end_2],...] (start_i < end_i), find the minimum number of rooms required to schedule all meetings without any conflicts.

// Note: (0,8),(8,10) is NOT considered a conflict at 8.

// Example 1:

// Input: intervals = [(0,40),(5,10),(15,20)]

// Output: 2
// Explanation:
// day1: (0,40)
// day2: (5,10),(15,20)

// Example 2:

// Input: intervals = [(4,9)]

// Output: 1

/**
 * Definition of Interval:
 * class Interval {
 *   constructor(start, end) {
 *     this.start = start;
 *     this.end = end;
 *   }
 * }
 */

class Solution {
  /**
   * @param {Interval[]} intervals
   * @returns {number}
   */
  minMeetingRooms(intervals) {
    let startArr = [];
    let endArr = [];

    for (const { start, end } of intervals) {
      startArr.push(start);
      endArr.push(end);
    }
    startArr = startArr.sort((a, b) => a - b);
    endArr = endArr.sort((a, b) => a - b);
    let right = 0;
    let left = 0;
    let count = 0;

    while (left < startArr.length) {
      if (startArr[left] >= endArr[right]) {
        right++;
      } else {
        count++;
      }
      left++;
    }
    return count;
  }
}
