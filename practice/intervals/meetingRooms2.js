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
    let startT = [];
    let endT = [];
    for (let i = 0; i < intervals.length; i++) {
      startT.push(intervals[i].start);
      endT.push(intervals[i].end);
    }
    startT = startT.sort((a, b) => a - b);
    endT = endT.sort((a, b) => a - b);
    let count = 0;
    let maxCount = 0;
    let left = 0;
    let right = 0;

    while (left < intervals.length) {
      if (startT[left] < endT[right]) {
        count += 1;
        left++;
      } else {
        count -= 1;
        right++;
      }
      maxCount = Math.max(count, maxCount);
    }

    return maxCount;
  }
}
