// You are given a 2-D matrix grid. Each cell can have one of three possible values:

// 0 representing an empty cell
// 1 representing a fresh fruit
// 2 representing a rotten fruit
// Every minute, if a fresh fruit is horizontally or vertically adjacent to a rotten fruit, then the fresh fruit also becomes rotten.

// Return the minimum number of minutes that must elapse until there are zero fresh fruits remaining. If this state is impossible within the grid, return -1.

// Input: grid = [[1,1,0],[0,1,1],[0,1,2]]

// Output: 4
// Example 2:

// Input: grid = [[1,0,1],[0,2,0],[1,0,1]]

// Output: -1


class Solution {
  /**
   * @param {number[][]} grid
   * @return {number}
   */
  orangesRotting(grid) {
    let rows = grid.length;
    let cols = grid[0].length;

    let rottonPositions = [];
    let freshCount = 0;  // just a counter instead of a Map

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 2) rottonPositions.push([r, c]);
        if (grid[r][c] === 1) freshCount++;
      }
    }

    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    const bfs = (r, c, nextQueue) => {
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;  // decrement when a fruit rots
          nextQueue.push([nr, nc]);
        }
      }
      return nextQueue;
    };
    let count = 0;
    while (rottonPositions.length !== 0) {
      let nextQueue = [];
      while (rottonPositions.length !== 0) {
        const [r, c] = rottonPositions.pop();
        nextQueue = bfs(r, c, nextQueue);
      }
      if (nextQueue.length > 0) count += 1;
      rottonPositions = nextQueue;
    }

    return freshCount > 0 ? -1 : count;  // if any fresh remain, return -1
  }
}
