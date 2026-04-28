// You are given an array of distinct integers nums and a target integer target. Your task is to return a list of all unique combinations of nums where the chosen numbers sum to target.
// The same number may be chosen from nums an unlimited number of times. Two combinations are the same if the frequency of each of the chosen numbers is the same, otherwise they are different.
// You may return the combinations in any order and the order of the numbers in each combination can be in any order.

// Input:
// nums = [2,5,6,9]
// target = 9

// Output: [[2,2,5],[9]]

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
        return;
      }
      if (target > n) return;
      if (left >= coins.length) return;

      for (let i = left; i < coins.length; i++) {
        res.push(coins[i]);
        let temp = dfs(target + coins[i], i, res);
        res.pop();
      }

      return;
    };

    dfs(0, 0, []);
    return result;
  }
}
