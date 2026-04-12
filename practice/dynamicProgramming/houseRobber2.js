// You are given an integer array nums where nums[i] represents the amount of money the ith house has. The houses are arranged in a circle, i.e. the first house and the last house are neighbors.
// You are planning to rob money from the houses, but you cannot rob two adjacent houses because the security system will automatically alert the police if two adjacent houses were both broken into.
// Return the maximum amount of money you can rob without alerting the police.
// Example 1:

// Input: nums = [3,4,3]

// Output: 4
// Explanation: You cannot rob nums[0] + nums[2] = 6 because nums[0] and nums[2] are adjacent houses. The maximum you can rob is nums[1] = 4.

// Example 2:

// Input: nums = [2,9,8,3,6]

// Output: 15

class Solution {
  /**
   * @param {number[]} nums
   * @return {number}
   */
  rob(nums) {
    let n = nums.length;
    if (n === 1) return nums[0];
    if (n === 2) return Math.max(nums[0], nums[1]);
    return Math.max(
      this.robHelper(nums.slice(0, -1)),
      this.robHelper(nums.slice(1)),
    );
  }

  robHelper(nums) {
    if (nums.length === 1) return nums[0];
    let result = [nums[0], Math.max(nums[0], nums[1])];
    for (let i = 2; i < nums.length; i++) {
      result[i] = Math.max(nums[i] + result[i - 2], result[i - 1]);
    }

    return result[result.length - 1];
  }
}
