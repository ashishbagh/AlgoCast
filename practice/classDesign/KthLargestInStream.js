// Design a class to find the kth largest integer in a stream of values, including duplicates. E.g. the 2nd largest from [1, 2, 3, 3] is 3. The stream is not necessarily sorted.

// Implement the following methods:

// constructor(int k, int[] nums) Initializes the object given an integer k and the stream of integers nums.
// int add(int val) Adds the integer val to the stream and returns the kth largest integer in the stream.

class KthLargest {
  /**
   * @param {number} k
   * @param {number[]} nums
   */
  constructor(k, nums) {
    this.k = k;
    this.nums = nums.sort((a, b) => a - b);
  }

  /**
   * @param {number} val
   * @return {number}
   */
  add(val) {
    let { k, nums } = this;
    nums.unshift(val);
    // use heap for O(1) insertion;
    // this is O(n) insertion;
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] > nums[i + 1]) {
        [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
      }
    }
    // this.nums = nums;
    return nums[nums.length - k];
  }
}
