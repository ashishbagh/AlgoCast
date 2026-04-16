// You are given a string s, return true if the s can be a palindrome after deleting at most one character from it.
// A palindrome is a string that reads the same forward and backward.

// Note: Alphanumeric characters consist of letters (A-Z, a-z) and numbers (0-9).
// Example 1:

// Input: s = "aca"

// Output: true
// Explanation: "aca" is already a palindrome.

// Example 2:
// Input: s = "abbadc"
// Output: false

class Solution {
  /**
   * @param {string} s
   * @return {boolean}
   */
  validPalindrome(s) {
    let r = s.length - 1;
    let l = 0;
    while (l < r) {
      if (s[l] !== s[r]) {
        return this.isPalindrome(s, l + 1, r) || this.isPalindrome(s, l, r - 1);
      }
      l++;
      r--;
    }

    return true;
  }

  isPalindrome(s, l, r) {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++;
      r--;
    }
    return true;
  }
}
