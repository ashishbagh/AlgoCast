// Given a square n x n matrix of integers matrix, rotate it by 90 degrees clockwise.
// You must rotate the matrix in-place. Do not allocate another 2D matrix and do the rotation.

// Example 1:
// Input: matrix = [
//   [1,2],
//   [3,4]
// ]

// Output: [
//   [3,1],
//   [4,2]
// ]
// Input: matrix = [
//   [1,2,3],
//   [4,5,6],
//   [7,8,9]
// ]

// Output: [
//   [7,4,1],
//   [8,5,2],
//   [9,6,3]
// ]

class Solution {
  /**
   * @param {number[][]} matrix
   * @return {void}
   */
  rotate(matrix) {
    matrix.reverse();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i; j < matrix[0].length; j++) {
        [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
      }
    }
    return matrix;
  }
}
