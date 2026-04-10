// You are given a string s consisting of lowercase english letters.

// We want to split the string into as many substrings as possible, while ensuring that each letter appears in at most one substring.

// Return a list of integers representing the size of these substrings in the order they appear in the string.

// Example 1:

// Input: s = "xyxxyzbzbbisl"

// Output: [5, 5, 1, 1, 1]
// Explanation: The string can be split into ["xyxxy", "zbzbb", "i", "s", "l"].

// Example 2:

// Input: s = "abcabc"

// Output: [6]

class Solution {
  /**
   * @param {string} S
   * @return {number[]}
   */
  partitionLabels(S) {
    let map = {};
    for (let i = 0; i < S.length; i++) {
      map[S[i]] = i;
    }
    let result = [];
    let end = 0;
    let start = 0;
    for (var i = 0; i < S.length; i++) {
      end = Math.max(end, map[S[i]]);
      if (i === end) {
        result.push(end - start + 1);
        start = i + 1;
      }
    }
    return result;
  }
}
