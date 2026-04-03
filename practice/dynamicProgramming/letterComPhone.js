// You are given a string digits made up of digits from 2 through 9 inclusive.

// Each digit (not including 1) is mapped to a set of characters as shown below:

// A digit could represent any one of the characters it maps to.

// Return all possible letter combinations that digits could represent. You may return the answer in any order.

// Input: digits = "34"

// Output: ["dg", "dh", "di", "eg", "eh", "ei", "fg", "fh", "fi"]
// Example 2:

// Input: digits = ""

// Output: []

class Solution {
  /**
   * @param {string} digits
   * @return {string[]}
   */
  letterCombinations(digits) {
    if (digits.length === 0) return [];
    let map = {
      1: "",
      2: "abc",
      3: "def",
      4: "ghi",
      5: "jkl",
      6: "mno",
      7: "pqrs",
      8: "tuv",
      9: "wxyz",
    };
    let result = [];

    const backtrack = (i, curr) => {

      if (curr.length === digits.length) {
        result.push(curr);;
        return;
      };

      for (const c of map[digits[i]]) {
        backtrack(i + 1, curr + c)
      }
      return;
    };

    backtrack(0, "");
    return result;
  }
}
