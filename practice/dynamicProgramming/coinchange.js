class Solution {
  /**
   * @param {number[]} coins
   * @param {number} amount
   * @return {number}
   */
  coinChange(coins, amount) {
    // let res=Infinity;
    let cache = {};
    const dfs = (target) => {
      if (target === 0) return 0;

      if (target < 0) return Infinity;

      if (cache[target] !== undefined) {
        return cache[target];
      }
      // Try each coin and find minimum
      let minCoins = Infinity;
      for (const coin of coins) {
        let result = dfs(target - coin);
        minCoins = Math.min(minCoins, 1 + result);
      }
      cache[target] = minCoins;
      return minCoins;
    };

    let result = dfs(amount);
    return result === Infinity ? -1 : result;
  }
}
