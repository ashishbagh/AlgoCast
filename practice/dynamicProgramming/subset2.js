// You are given an array nums of integers, which may contain duplicates. Return all possible subsets.
// The solution must not contain duplicate subsets. You may return the solution in any order.

// Example 1:

// Input: nums = [1,2,1]

// Output: [[],[1],[1,2],[1,1],[1,2,1],[2]]

class Solution {
  /**
   * @param {number[]} nums
   * @return {number[][]}
   */
  subsetsWithDup(nums) {
    let result = [];
    nums = nums.sort((a, b) => a - b);

    const backtracking = (pointer, subset) => {
      if (pointer > nums.length) return;
      result.push([...subset]);
      for (let i = pointer; i < nums.length; i++) {
        if (i > pointer && nums[i] === nums[i - 1]) continue;
        subset.push(nums[i]);
        backtracking(i + 1, subset);
        subset.pop();
      }
      return;
    };

    backtracking(0, []);
    return result;
  }
}
