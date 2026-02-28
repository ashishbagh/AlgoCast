// You are given an integer array heights where heights[i] represents the height of the
// You may choose any two bars to form a container. Return the maximum amount of water a container can store.

// Input: height = [1,7,2,5,4,7,3,6]

// Output: 36

class Solution {
  /**
   * @param {number[]} heights
   * @return {number}
   */
  maxArea(heights) {
    let arr = heights;
    let left = 0;
    let right = arr.length - 1;
    let maxOutput = 0;
    while (left < right) {
      let water = (right - left) * Math.min(arr[left], arr[right]);
      maxOutput = Math.max(water, maxOutput);
      if (arr[left] > arr[right]) {
        right--;
      } else {
        left++;
      }
    }

    return maxOutput;
  }
}
