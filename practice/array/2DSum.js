// You are given a 2D matrix matrix, handle multiple queries of the following type:

// Calculate the sum of the elements of matrix inside the rectangle defined by its upper left corner (row1, col1) and lower right corner (row2, col2).
// Implement the NumMatrix class:

// NumMatrix(int[][] matrix) Initializes the object with the integer matrix matrix.
// int sumRegion(int row1, int col1, int row2, int col2) Returns the sum of the elements of matrix inside the rectangle defined by its upper left corner (row1, col1) and lower right corner (row2, col2).
// You must design an algorithm where sumRegion works on O(1) time complexity.

// Input: ["NumMatrix", "sumRegion", "sumRegion", "sumRegion"]
// [[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]

// Output: [null, 8, 11, 12]

class NumMatrix {
  /**
   * @param {number[][]} matrix
   */
  constructor(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    this.prefix = Array.from({ length: rows + 1 }, () =>
      Array(cols + 1).fill(0),
    );

    for (let r = 0; r < rows; r++) {
      let prefix = 0;
      for (let c = 0; c < cols; c++) {
        prefix += matrix[r][c];
        let above = this.prefix[r][c + 1];
        this.prefix[r + 1][c + 1] = prefix + above;
      }
    }

    console.log(this.prefix);
  }

  /**
   * @param {number} row1
   * @param {number} col1
   * @param {number} row2
   * @param {number} col2
   * @return {number}
   */
  sumRegion(row1, col1, row2, col2) {
    let ro1 = row1 + 1,
      co1 = col1 + 1,
      ro2 = row2 + 1,
      co2 = col2 + 1;

    let bottomRight = this.prefix[ro2][co2];
    let above = this.prefix[ro1 - 1][co2];
    let left = this.prefix[ro2][co1 - 1];
    let start = this.prefix[ro1 - 1][co1 - 1];

    return bottomRight - above - left + start;

    return 1;
  }
}

/**
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */
