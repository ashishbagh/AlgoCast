class Solution {
  /**
   * @param {number[]} nums
   * @param {number} target
   * @returns {number[][]}
   */
  combinationSum(coins, n) {
    // let cache={};
    let result = [];

    const dfs = (target, left, res) => {
      if (target === n) {
        result.push([...res]);
        return 1;
      }
      if (target > n) return 0;
      if (left >= coins.length) return 0;

      let ways = 0;
      for (let i = left; i < coins.length; i++) {
        res.push(coins[i]);
        let temp = dfs(target + coins[i], i, res);
        ways += temp;
        res.pop();
      }

      return ways;
    };

    dfs(0, 0, []);
    return result;
  }
}
