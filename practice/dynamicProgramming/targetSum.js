class Solution {
  /**
   * @param {number[]} nums
   * @param {number} target
   * @return {number}
   */
  findTargetSumWays(nums, target) {
    let res = 0;
    let cache = {};
    const backTracking = (i, sum) => {
      if (i === nums.length) {
        if (sum === target) return 1;
        else return 0;
      }
      let key = `${i},${sum}`;
      cache[key] =
        backTracking(i + 1, nums[i] + sum) +
        backTracking(i + 1, -nums[i] + sum);
      return cache[key];
    };

    return backTracking(0, 0);
  }
}
