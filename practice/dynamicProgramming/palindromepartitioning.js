// Given a string s, split s into substrings where every substring is a palindrome. Return all possible lists of palindromic substrings.

// You may return the solution in any order.

// Example 1:

// Input: s = "aab"

// Output: [["a","a","b"],["aa","b"]]
// Example 2:

// Input: s = "a"

// Output: [["a"]]

class Solution {
  /**
   * @param {string} s
   * @return {string[][]}
   */
  partition(s) {
    let path = [];
    let result = [];
    const palidrom = (l, r) => {
      while (l < r) {
        if (s[l] !== s[r]) return false;
        r--;
        l++;
      }
      return true;
    };

    const dfs = (i) => {
      if (i >= s.length) {
        result.push([...path]);
        return;
      }
      for (let j = i; j < s.length; j++) {
        if (palidrom(i, j)) {
          path.push(s.slice(i, j + 1));
          dfs(j + 1);
          path.pop();
        }
      }
    };

    dfs(0);

    return result;
  }
}
