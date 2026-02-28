// Given a string s, return the longest substring of s that is a palindrome.
// A palindrome is a string that reads the same forward and backward.

// If there are multiple palindromic substrings that have the same length, return any one of them.
// Example 1:

// Input: s = "ababd"

// Output: "bab"

class Solution {
  /**
   * @param {string} s
   * @return {string}
   */
  longestPalindrome(s) {
    let res = "";
    let resLen = 0;

    const checkPalin = (r, l) => {
      while (l >= 0 && r < s.length && s[r] === s[l]) {
        if (r - l + 1 > resLen) {
          res = s.slice(l, r + 1);
          resLen = r - l + 1;
        }
        l--;
        r++;
      }
    };

    for (let i = 0; i < s.length; i++) {
      // odd
      checkPalin(i, i);
      // even
      checkPalin(i, i + 1);
    }

    return res;
  }
}
