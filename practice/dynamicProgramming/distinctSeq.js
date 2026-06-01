// You are given two strings s and t, both consisting of english letters.

// Return the number of distinct subsequences of s which are equal to t.

// Example 1:

// Input: s = "caaat", t = "cat"

// Output: 3
// Explanation: There are 3 ways you can generate "cat" from s.

// (c)aa(at)
// (c)a(a)a(t)
// (ca)aa(t)
// Example 2:

// Input: s = "xxyxy", t = "xy"

// Output: 5
// Explanation: There are 5 ways you can generate "xy" from s.

// (x)x(y)xy
// (x)xyx(y)
// x(x)(y)xy
// x(x)yx(y)
// xxy(x)(y)

class Solution {
  /**
   * @param {string} s
   * @param {string} t
   * @return {number}
   */
  numDistinct(s, t) {
    let cache = new Map();
    const dfs = (i, j) => {
      let key = `${i},${j}`;
      if (cache.has(key)) return cache.get(key);
      if (j === t.length) {
        return 1;
      }
      if (i === s.length) return 0;
      let ways = 0;
      if (s[i] === t[j]) {
        ways = dfs(i + 1, j + 1) + dfs(i + 1, j);
      } else {
        ways = dfs(i + 1, j);
      }
      cache.set(key, ways);
      return ways;
    };

    return dfs(0, 0);
  }
}
