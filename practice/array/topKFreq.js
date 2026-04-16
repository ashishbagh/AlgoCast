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
    let map = new Map();
    for (const num of nums) {
      let val = map.get(num);
      if (!val) map.set(num, 1);
      else map.set(num, val + 1);
    }
    map = new Map([...map.entries()].sort((a, b) => a[1] - b[1]));
    let res = [];
    for (const key of map.keys()) {
      res.push(key);
    }
    return res.slice(map.size - k, map.size);
  }

  topKFrequentBucketSort(nums, k) {
    /// O(n)
    let n = nums.length;
    let arr = Array.from({ length: n + 1 }, () => []);
    let map = new Map();

    for (const num of nums) {
      let val = map.get(num);
      if (!val) {
        map.set(num, 1);
      } else {
        map.set(num, val + 1);
      }
    }
    for (const key of map.keys()) {
      let val = map.get(key);
      arr[val].push(key);
    }
    let right = n;
    let res = [];
    while (k > 0) {
      k = k - arr[right].length;
      res = [...res, ...arr[right]];
      right--;
    }
    return res;
  }
}
