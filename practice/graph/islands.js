// Given a 2D grid grid where '1' represents land and '0' represents water, count and return the number of islands.

// An island is formed by connecting adjacent lands horizontally or vertically and is surrounded by water. You may assume water is surrounding the grid (i.e., all the edges are water).

// Example 1:

// Input: grid = [
//     ["0","1","1","1","0"],
//     ["0","1","0","1","0"],
//     ["1","1","0","0","0"],
//     ["0","0","0","0","0"]
//   ]
// Output: 1

class Solution {
  /**
   * @param {character[][]} grid
   * @return {number}
   */
  numIslands(grid) {
    let l = grid[0].length;
    let h = grid.length;
    let visited = new Set();

    const dfs = (i, j) => {
      let key = `${i},${j}`;
      if (
        i < 0 ||
        j < 0 ||
        i >= h ||
        j >= l ||
        visited.has(key) ||
        grid[i][j] !== "1"
      ) {
        return;
      }
      visited.add(key);
      dfs(i + 1, j);
      dfs(i - 1, j);
      dfs(i, j + 1);
      dfs(i, j - 1);
    };

    let count = 0;
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < l; j++) {
        if (grid[i][j] === "1" && !visited.has(`${i},${j}`)) {
          count += 1;
          dfs(i, j);
        }
      }
    }
    return count;
  }
}
