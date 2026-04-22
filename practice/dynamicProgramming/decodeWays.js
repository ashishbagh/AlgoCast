// A string consisting of uppercase english characters can be encoded to a number using the following mapping:

// 'A' -> "1"
// 'B' -> "2"
// ...
// 'Z' -> "26"
// To decode a message, digits must be grouped and then mapped back into letters using the reverse of the mapping above. There may be multiple ways to decode a message. For example, "1012" can be mapped into:

// "JAB" with the grouping (10 1 2)
// "JL" with the grouping (10 12)
// The grouping (1 01 2) is invalid because 01 cannot be mapped into a letter since it contains a leading zero.

// Given a string s containing only digits, return the number of ways to decode it. You can assume that the answer fits in a 32-bit integer.

class Solution {
  /**
   * @param {string} s
   * @return {number}
   */
  numDecodings(s) {
    let res = 0;
    let cache = {};
    const dfs = (i) => {
      if (cache[i]) return cache[i];
      if (i === s.length) return 1;
      if (i > s.length) return 0;
      if (s[i] === "0") return 0;
      res = dfs(i + 1);
      if (s[i] === "1" || (s[i] === "2" && s[i + 1] < "7")) {
        res += dfs(i + 2);
      }
      cache[i] = res;
      return res;
    };

    return dfs(0);
  }
}
