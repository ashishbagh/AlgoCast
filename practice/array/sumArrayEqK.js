// Subarray Sum Equals K
// Medium
// Topics
// Company Tags
// You are given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.
// A subarray is a contiguous non-empty sequence of elements within an array.

// Example 1:
// Input: nums = [2,-1,1,2], k = 2

// Output: 4
// Explanation: [2], [2,-1,1], [-1,1,2], [2] are the subarrays whose sum is equals to k.
// Example 2:
// Input: nums = [4,4,4,4,4,4], k = 4

// Output: 6

class Solution {
  /**
   * @param {number[]} nums
   * @param {number} k
   * @return {number}
   */
  subarraySum(nums, k) {
    let map = { 0: 1 };
    let prefixSum = 0;
    let count = 0;
    for (const num of nums) {
      prefixSum += num;
      let temp = prefixSum - k;
      if (map[temp]) {
        count += map[temp];
      }
      if (!map[prefixSum]) {
        map[prefixSum] = 1;
      } else {
        map[prefixSum] += 1;
      }
    }

    return count;
  }
}
