// You are given two strings word1 and word2, each consisting of lowercase English letters.

// You are allowed to perform three operations on word1 an unlimited number of times:

// Insert a character at any position
// Delete a character at any position
// Replace a character at any position
// Return the minimum number of operations to make word1 equal word2.
// word1="abd"
// word2="acd"

class Solution {
  /**
   * @param {string} word1
   * @param {string} word2
   * @return {number}
   */
  minDistance(word1, word2) {
    let m = word1.length;
    let n = word2.length;

    let dp = Array.from({ length: m + 1 }, () =>
      new Array(n + 1).fill(Infinity),
    );

    for (let j = 0; j <= n; j++) {
      dp[m][j] = n - j; // insert (n - j) chars into word1
    }
    for (let i = 0; i <= m; i++) {
      dp[i][n] = m - i; // delete (m - i) chars from word1
    }

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        if (word1[i] === word2[j]) {
          dp[i][j] = dp[i + 1][j + 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i + 1][j + 1], dp[i][j + 1], dp[i + 1][j]);
        }
      }
    }
    return dp[0][0];
  }
}
