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
