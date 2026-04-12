// Given a string s, return the number of substrings within s that are palindromes.

// A palindrome is a string that reads the same forward and backward.

// Example 1:

// Input: s = "abc"

// Output: 3
// Explanation: "a", "b", "c".

// Example 2:

// Input: s = "aaa"

// Output: 6
// Explanation: "a", "a", "a", "aa", "aa", "aaa". Note that different substrings are counted as different palindromes even if the string contents are the same.

class Solution {
  /**
   * @param {string} s
   * @return {number}
   */
  countSubstrings(s) {
    let res = 0;
    const isPalindrom = (l, r) => {
      let count = 0;
      while (l >= 0 && r < s.length && s[l] === s[r]) {
        r++;
        l--;
        count++;
      }
      return count;
    };

    for (let i = 0; i < s.length; i++) {
      res += isPalindrom(i, i) + isPalindrom(i, i + 1);
    }
    return res;
  }
}
