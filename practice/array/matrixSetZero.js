// Given an m x n matrix of integers matrix, if an element is 0, set its entire row and column to 0's.
// You must update the matrix in-place.
// Follow up: Could you solve it using O(1) space?

// Example 1: Input: matrix = [
//   [0,1],
//   [1,0]
// ]

// Output: [
//   [0,0],
//   [0,0]
// ]

// Input: matrix = [
//   [1,2,3],
//   [4,0,5],
//   [6,7,8]
// ]

// Output: [
//   [1,0,3],
//   [0,0,0],
//   [6,0,8]
// ]

class Solution {
  /**
   * @param {number[][]} matrix
   * @return {void}
   */
  setZeroes(matrix) {
    let rows = matrix.length;
    let cols = matrix[0].length;
    let visited = new Set();

    const dirty = (r, c) => {
      visited.add(`{${r},${c}}`);
      for (let i = 0; i < rows; i++) {
        if (matrix[i][c] === 0) continue;
        matrix[i][c] = 0;
        visited.add(`{${i},${c}}`);
      }

      for (let j = 0; j < cols; j++) {
        if (matrix[r][j] === 0) continue;
        matrix[r][j] = 0;
        visited.add(`{${r},${j}}`);
      }
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] === 0 && !visited.has(`{${r},${c}}`)) {
          dirty(r, c);
        }
      }
    }
    return matrix;
  }
}
