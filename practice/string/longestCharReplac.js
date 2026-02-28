// You are given a string s consisting of only uppercase english characters and an integer k. You can choose up to k characters of the string and replace them with any other uppercase English character.

// After performing at most k replacements, return the length of the longest substring which contains only one distinct character.

// Example 1:

// Input: s = "XYYX", k = 2

// Output: 4
// Explanation: Either replace the 'X's with 'Y's, or replace the 'Y's with 'X's.

// Example 2:

// Input: s = "AAABABB", k = 1

// Output: 5

class Solution {
  /**
   * @param {string} s
   * @param {number} k
   * @return {number}
   */
  characterReplacement(s, k) {
    let map = {};
    let maxF = 0;
    let left = 0;
    let res = 0;
    for (let i = 0; i < s.length; i++) {
      if (!map[s[i]]) {
        map[s[i]] = 1;
      } else {
        map[s[i]] += 1;
      }
      maxF = Math.max(maxF, map[s[i]]);
      while (i - left + 1 - maxF > k) {
        map[s[left]] -= 1;
        left++;
      }
      res = Math.max(res, i - left + 1);
    }

    return res;
  }
}
