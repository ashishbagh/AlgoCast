// Given an integer array nums, find a subarray that has the largest product within the array and return it.
// A subarray is a contiguous non-empty sequence of elements within an array.
// You can assume the output will fit into a 32-bit integer.
// Example 1:

// Input: nums = [1,2,-3,4]
// Output: 4
// Example 2:

// Input: nums = [-2,-1]

// Output: 2

class Solution {
  /**
   * @param {number[]} nums
   * @return {number}
   */
  maxProduct(nums) {
    let result = Math.max(...nums);

    let currMax = 1;
    let currMin = 1;

    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === 0) {
        currMax = 1;
        currMin = 1;
      }

      let temp = currMax * nums[i];
      currMax = Math.max(temp, currMin * nums[i], nums[i]);
      currMin = Math.min(temp, currMin * nums[i], nums[i]);
      result = Math.max(result, currMax);
    }

    return result;
  }
}
