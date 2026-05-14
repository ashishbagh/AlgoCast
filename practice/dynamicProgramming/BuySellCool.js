// You are given an integer array prices where prices[i] is the price of NeetCoin on the ith day.

// You may buy and sell one NeetCoin multiple times with the following restrictions:

// After you sell your NeetCoin, you cannot buy another one on the next day (i.e., there is a cooldown period of one day).
// You may only own at most one NeetCoin at a time.
// You may complete as many transactions as you like.

// Return the maximum profit you can achieve.

// Example 1:
// Input: prices = [1,3,4,0,4]
// Output: 6

class Solution {
  /**
   * @param {number[]} prices
   * @return {number}
   */
  maxProfit(prices) {
    let memo = new Map();
    const dfs = (i, buying) => {
      if (i >= prices.length) {
        return 0;
      }
      let key = `${i},${buying}`;
      if (memo.has(key)) return memo.get(key);
      let cooldown = dfs(i + 1, buying); // cooldown means doing nothing on that day
      let ans;
      if (buying) {
        let buy = dfs(i + 1, !buying) - prices[i]; /// buy means spending on the day
        ans = Math.max(buy, cooldown);
      } else {
        let sell = dfs(i + 2, !buying) + prices[i]; // selling means getting money so plus
        ans = Math.max(sell, cooldown);
      }
      memo.set(key, ans);
      return ans;
    };
    return dfs(0, true);
  }
}
