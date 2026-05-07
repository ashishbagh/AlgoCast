// You are given an m x n 2-D integer array matrix and an integer target.

// Each row in matrix is sorted in non-decreasing order.
// The first integer of every row is greater than the last integer of the previous row.
// Return true if target exists within matrix or false otherwise.

// Can you write a solution that runs in O(log(m * n)) time?

// Example 1:
// Input: matrix = [[1,2,4,8],[10,11,12,13],[14,20,30,40]], target = 10

// Output: true

class Solution {
  /**
   * @param {number[][]} matrix
   * @param {number} target
   * @return {boolean}
   */
  searchMatrix(matrix, target) {
    let row = matrix.length;
    let col = matrix[0].length;
    let left = 0;
    let right = row * col - 1;
    while (left <= right) {
      let mid = parseInt((left + right) / 2);
      let r = Math.floor(mid / col);
      let c = Math.floor(mid % col);
      let val = matrix[r][c];
      if (val > target) {
        right = mid - 1;
      } else if (val < target) {
        left = mid + 1;
      } else {
        return true;
      }
    }
    return false;
  }
}
