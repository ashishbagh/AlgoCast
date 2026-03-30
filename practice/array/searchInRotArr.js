// You are given an array of length n which was originally sorted in ascending order. It has now been rotated between 1 and n times. For example, the array nums = [1,2,3,4,5,6] might become:

// [3,4,5,6,1,2] if it was rotated 4 times.
// [1,2,3,4,5,6] if it was rotated 6 times.
// Given the rotated sorted array nums and an integer target, return the index of target within nums, or -1 if it is not present.

// You may assume all elements in the sorted rotated array nums are unique,

// A solution that runs in O(n) time is trivial, can you write an algorithm that runs in O(log n) time?

// Input: nums = [3,4,5,6,1,2], target = 1

// Output: 4

class Solution {
  /**
   * @param {number[]} nums
   * @param {number} target
   * @return {number}
   */
  search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      let mid = parseInt((left + right) / 2);
      if (nums[mid] === target) {
        return mid;
      }

      // left sorted condition
      if (nums[left] <= nums[mid]) {
        if (target > nums[mid] || target < nums[left]) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      } else {
        // right sorted condition
        if (target < nums[mid] || target > nums[right]) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
    }
    return -1;
  }

  //  let left=0;
  //   let right=nums.length-1;
}
