// You are given an array of integers cost where cost[i] is the cost of taking a step from the ith floor of a staircase. After paying the cost, you can step to either the (i + 1)th floor or the (i + 2)th floor.

// You may choose to start at the index 0 or the index 1 floor.

// Return the minimum cost to reach the top of the staircase, i.e. just past the last index in cost.

// Example 1:

// Input: cost = [1,2,3]

Output: 2;

class Solution {
  /**
   * @param {number[]} cost
   * @return {number}
   */
  minCostClimbingStairs(cost) {
    let cache = {};
    //cost.push(0);
    const dfs = (i) => {
      if (i >= cost.length) return 0;

      if (cache[i] !== undefined) {
        return cache[i];
      }
      cache[i] = cost[i] + Math.min(dfs(i + 1), dfs(i + 2));
      return cache[i];
    };

    return Math.min(dfs(0), dfs(1));
  }
}
