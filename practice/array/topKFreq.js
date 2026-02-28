// Top K Frequent Elements Solved
// Given an integer array nums and an integer k, return the k most frequent elements within the array.

// The test cases are generated such that the answer is always unique.

// You may return the output in any order.

// Example 1:

// Input: nums = [1,2,2,3,3,3], k = 2

// Output: [2,3]

class Solution {
  /**
   * @param {number[]} nums
   * @param {number} k
   * @return {number[]}
   */
  topKFrequent(nums, k) {
    let map = {};
    let result = [];
    for (let i = 0; i < nums.length; i++) {
      result[i + 1] = [];
      if (!map[nums[i]]) {
        map[nums[i]] = 1;
      } else {
        map[nums[i]] += 1;
      }
    }
    let arr = Object.keys(map);
    arr.forEach((element) => {
      result[map[element]].push(element);
    });

    let res = [];
    for (let i = result.length - 1; i > 0; i--) {
      let tempArr = result[i];
      for (let j = 0; j < tempArr.length; j++) {
        res.push(tempArr[j]);
        if (res.length === k) {
          return res;
        }
      }
    }

    return res;
  }
}
