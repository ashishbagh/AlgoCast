// You are given an array nums consisting of n elements where each element is an integer representing a color:

// 0 represents red
// 1 represents white
// 2 represents blue
// Your task is to sort the array in-place such that elements of the same color are grouped together and arranged in the order: red (0), white (1), and then blue (2).
// You must not use any built-in sorting functions to solve this problem.

// Example 1:
// Input: nums = [1,0,1,2]

// Output: [0,1,1,2]
// Example 2:

// Input: nums = [2,1,0]
// Output: [0,1,2]

class Solution {
  /**
   * @param {number[]} nums
   * @return {void} Do not return anything, modify nums in-place instead.
   */
  sortColors(nums) {
    let left = 0;
    let curr = 0;
    let right = nums.length - 1;

    while (curr <= right) {
      if (nums[curr] === 0 && curr !== left) {
        [nums[left], nums[curr]] = [nums[curr], nums[left]];
        left++;
      } else if (nums[curr] === 2) {
        [nums[curr], nums[right]] = [nums[right], nums[curr]];
        right--;
      } else {
        curr++;
      }
    }
    return nums;
  }
}
