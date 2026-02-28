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
