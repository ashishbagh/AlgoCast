class Solution {
  /**
   * @param {number[]} nums
   * @return {number}
   */
  longestConsecutive(nums) {
    if (nums.length === 0) {
      return 0;
    }

    let map = new Map();
    let min = nums[0];
    let max = nums[0];
    for (let i = 0; i < nums.length; i++) {
      if (!map.get(nums[i])) {
        map.set(nums[i], nums[i]);
      }
      min = Math.min(nums[i], min);
      max = Math.max(nums[i], max);
    }

    if (min === max) {
      return 1;
    }
    let count = 1;
    let maxCount = 0;
    for (let i = min + 1; i <= max; i++) {
      if (map.get(i) !== undefined) {
        if (count > 1 && map.get(i - 1) === undefined) {
          count = 0;
          continue;
        }
        count += 1;
      } else {
        count = 0;
      }
      maxCount = Math.max(maxCount, count);
    }
    return maxCount;
  }

  optimised(nums) {
    let set = new Set(nums);
    let maxCount = 0;
    for (const num of set) {
      if (!set.has(num - 1)) {
        let length = 1;
        let currentNum = num;
        while (set.has(currentNum + 1)) {
          length++;
          currentNum++;
        }
        maxCount = Math.max(maxCount, length);
      }
    }
    return maxCount;
  }
}
