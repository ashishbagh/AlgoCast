// You are given two strings s1 and s2.
// Return true if s2 contains a permutation of s1, or false otherwise. That means if a permutation of s1 exists as a substring of s2, then return true.
// Both strings only contain lowercase letters.

// Example 1:
// Input: s1 = "abc", s2 = "lecabee"

// Output: true
// Explanation: The substring "cab" is a permutation of "abc" and is present in "lecabee".
// Example 2:
// Input: s1 = "abc", s2 = "lecaabee"

// Output: false

class Solution {
  /**
   * @param {string} s1
   * @param {string} s2
   * @return {boolean}
   */
  checkInclusion(s1, s2) {
    let left = 0;
    let arr = s1.split("");
    while (left < s2.length) {
      if (arr.indexOf(s2[left]) !== -1) {
        let count = left + 1;
        let tempStr = s2[left];
        while (tempStr.length !== arr.length && count < s2.length) {
          tempStr = tempStr + s2[count];
          count++;
        }
        if (arr.sort().join("") === tempStr.split("").sort().join("")) {
          return true;
        }
      }
      left++;
    }

    return false;
  }
}
