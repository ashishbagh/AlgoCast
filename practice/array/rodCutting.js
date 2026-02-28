const rodCut = (arr, N) => {
  //const dp = create2DArray(N + 1, N + 1);
  const dp = new Array(N + 1).fill(null).map(() => new Array(N + 1).fill(0));
  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= N; j++) {
      if (j < i) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], arr[i - 1] + dp[i][j - i]);
      }
    }
  }
  console.log(dp[N][N]);
};

// Creates a 2D array with given rows, cols, and optional initial value
function create2DArray(rows, cols, initialValue = 0) {
  return Array.from({ length: rows }, () => Array(cols).fill(initialValue));
}

rodCut([3, 5, 8, 9, 10, 17, 17, 20], 8);

// memoization

// User function Template for javascript
/**
 * @param {number[]} price
 * @returns {number}
 */

class Solution {
  constructor() {
    this.cache = {};
  }
  cutRod(prices, n = prices.length) {
    // Base case: if the rod length is 0, no profit can be made.
    if (n === 0) {
      return 0;
    }

    // Initialize max_value to negative infinity
    let max_value = -Infinity; // Using -Infinity ensures any valid profit is higher

    // Iterate through all possible lengths for the first cut (from 1 to n)
    for (let i = 1; i <= n; i++) {
      // Calculate the profit from the current cut (prices[i-1])
      // plus the maximum profit from the remaining rod (n - i)
      // Note: prices array is 0-indexed, so price for length i is at prices[i-1]
      if (!this.cache[n - i]) {
        this.cache[n - i] = this.cutRod(prices, n - i);
      }
      const current_profit = prices[i - 1] + this.cache[n - i];
      // Update max_value if the current combination yields a higher profit
      max_value = Math.max(max_value, current_profit);
    }
    return max_value;
  }
}
