class Solution {
  /**
   * @param {number[]} nums
   * @return {number}
   */
  missingNumber(nums) {
    let XOR = nums.length;
    for (let i = 0; i < nums.length; i++) {
      XOR ^= i ^ nums[i];
    }

    return XOR;
  }
}
