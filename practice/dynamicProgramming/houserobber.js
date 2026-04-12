class Solution {
  /**
   * @param {number[]} nums
   * @return {number}
   */
  rob(nums) {
    let n = nums.length;
    if (n === 1) return nums[0];
    let max = [nums[0], Math.max(nums[0], nums[1])];

    for (let i = 2; i < n; i++) {
      max[i] = Math.max(nums[i] + max[i - 2], max[i - 1]);
    }
    return max[max.length - 1];
  }
}
