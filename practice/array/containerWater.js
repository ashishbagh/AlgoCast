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
    let right = heights.length - 1;
    let left = 0;
    let max = 0;
    while (left < right) {
      let output = (right - left) * Math.min(heights[left], heights[right]);
      max = Math.max(max, output);
      if (heights[left] < heights[right]) left++;
      else right--;
    }
    return max;
  }
}
