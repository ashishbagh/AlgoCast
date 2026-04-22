// You are given a rectangular island heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c).

// The islands borders the Pacific Ocean from the top and left sides, and borders the Atlantic Ocean from the bottom and right sides.

// Water can flow in four directions (up, down, left, or right) from a cell to a neighboring cell with height equal or lower. Water can also flow into the ocean from cells adjacent to the ocean.

// Find all cells where water can flow from that cell to both the Pacific and Atlantic oceans. Return it as a 2D list where each element is a list [r, c] representing the row and column of the cell. You may return the answer in any order.

// Example 1:

class Solution {
  /**
   * @param {number[][]} heights
   * @return {number[][]}
   */
  pacificAtlantic(heights) {
    let rows = heights.length;
    let cols = heights[0].length;
    let pac = new Set();
    let atl = new Set();

    const dfs = (r, c, visited, prevHeight) => {
      const key = `${r},${c}`;
      if (
        r < 0 ||
        c < 0 ||
        visited.has(key) ||
        r === rows ||
        c === cols ||
        heights[r][c] < prevHeight
      ) {
        return;
      }
      visited.add(key);
      dfs(r + 1, c, visited, heights[r][c]);
      dfs(r - 1, c, visited, heights[r][c]);
      dfs(r, c + 1, visited, heights[r][c]);
      dfs(r, c - 1, visited, heights[r][c]);
    };

    // col top and bottom
    for (let c = 0; c < cols; c++) {
      dfs(0, c, pac, heights[0][c]);
      dfs(rows - 1, c, atl, heights[rows - 1][c]);
    }

    // rows left and right
    for (let i = 0; i < rows; i++) {
      dfs(i, 0, pac, heights[i][0]);
      dfs(i, cols - 1, atl, heights[i][cols - 1]);
    }

    let res = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        // if touchin both ocean meaning flowing
        if (pac.has(key) && atl.has(key)) {
          res.push([r, c]);
        }
      }
    }

    return res;
  }
}
