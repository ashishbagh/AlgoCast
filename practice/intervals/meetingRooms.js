// Given an array of meeting time interval objects consisting of start and end times [[start_1,end_1],[start_2,end_2],...] (start_i < end_i), determine if a person could add all meetings to their schedule without any conflicts.
// Note: (0,8),(8,10) is not considered a conflict at 8

// Example 1:
// Input: intervals = [(0,30),(5,10),(15,20)]
// Output: false

class Solution {
  /**
   * @param {Interval[]} intervals
   * @returns {boolean}
   */
  canAttendMeetings(intervals) {
    const arr = intervals.sort((a, b) => a.start - b.start);
    for (let i = 1; i < arr.length; i++) {
      let interFirstEnd = arr[i - 1].end;
      let interSecondStart = arr[i].start;
      if (interFirstEnd > interSecondStart) {
        return false;
      }
    }
    return true;
  }
}
