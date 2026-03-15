// Max Area of Island

// You are given a matrix grid where grid[i] is either a 0 (representing water) or 1 (representing land).

// An island is defined as a group of 1's connected horizontally or vertically. You may assume all four edges of the grid are surrounded by water.

// The area of an island is defined as the number of cells within the island.

// Return the maximum area of an island in grid. If no island exists, return 0.

// Example 1:
// Input: grid = [
//   [0,1,1,0,1],
//   [1,0,1,0,1],
//   [0,1,1,0,1],
//   [0,1,0,0,1]
// ]

// Output: 6

class Solution {
  /**
   * @param {number[][]} grid
   * @return {number}
   */
  maxAreaOfIsland(grid) {
    let maxArea = 0;
    let rows = grid.length;
    let cols = grid[0].length;
    let set = new Set();
    let area = [0];
    const dfs = (r, c, visited) => {
      let key = `${r},${c}`;
      if (
        r < 0 ||
        c < 0 ||
        r >= rows ||
        c >= cols ||
        grid[r][c] !== 1 ||
        visited.has(key)
      ) {
        return;
      }
      visited.add(key);
      area[0]++;
      dfs(r + 1, c, visited);
      dfs(r - 1, c, visited);
      dfs(r, c + 1, visited);
      dfs(r, c - 1, visited);
      return;
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1) {
          dfs(r, c, set);
          maxArea = Math.max(maxArea, area[0]);
          area[0] = 0;
        }
      }
    }
    return maxArea;
  }
}
