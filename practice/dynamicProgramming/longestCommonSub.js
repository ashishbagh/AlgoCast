// Given two strings text1 and text2, return the length of the longest common subsequence between the two strings if one exists, otherwise return 0.

// A subsequence is a sequence that can be derived from the given sequence by deleting some or no elements without changing the relative order of the remaining characters.

// For example, "cat" is a subsequence of "crabt".
// A common subsequence of two strings is a subsequence that exists in both strings.

// Example 1:

// Input: text1 = "cat", text2 = "crabt"

// Output: 3 //"cat"

class Solution {
  /**
   * @param {string} text1
   * @param {string} text2
   * @return {number} // O(m+n)
   */
  longestCommonSubsequence(text1, text2) {
    let cache = {};
    const dfs = (i, j) => {
      const key = `${i},${j}`;
      if (i === text1.length || j === text2.length) return 0;
      if (key in cache) return cache[key];

      if (text1[i] === text2[j]) {
        cache[key] = 1 + dfs(i + 1, j + 1);
      } else {
        cache[key] = Math.max(dfs(i + 1, j), dfs(i, j + 1));
      }

      return cache[key];
    };

    return dfs(0, 0);
  }
}

//dp approach time complexity O(m*n)

function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (text1[i] === text2[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  return dp[0][0];
}
