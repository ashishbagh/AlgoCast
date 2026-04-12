// There is an m x n grid where you are allowed to move either down or to the right at any point in time.
// Given the two integers m and n, return the number of possible unique paths that can be taken from the top-left corner of the grid (grid[0][0]) to the bottom-right corner (grid[m - 1][n - 1]).

// You may assume the output will fit in a 32-bit integer.
// Input: m = 3, n = 6
// Output: 21

// Input: m = 3, n = 3
// Output: 6

class Solution {
  /**
   * @param {number} m
   * @param {number} n
   * @return {number}
   */
  uniquePaths(m, n) {
    let cache = {};
    const dfs = (r, c) => {
      let key = `${r},${c}`;
      if (cache[key]) return cache[key];
      if (r === m - 1 && c === n - 1) {
        return 1;
      }
      if (r < 0 || c < 0 || r >= m || c >= n) {
        return 0;
      }
      cache[key] = dfs(r + 1, c) + dfs(r, c + 1);
      return cache[key];
    };
    return dfs(0, 0);
  }
}
