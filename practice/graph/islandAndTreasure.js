// You are given a
// m×n 2D grid initialized with these three possible values:

// -1 - A water cell that can not be traversed.
// 0 - A treasure chest.
// INF - A land cell that can be traversed. We use the integer 2^31 - 1 = 2147483647 to represent INF.
// Fill each land cell with the distance to its nearest treasure chest. If a land cell cannot reach a treasure chest then the value should remain INF.

// Assume the grid can only be traversed up, down, left, or right.

// Modify the grid in-place.

// Example 1:

// Input: [
//   [2147483647,-1,0,2147483647],
//   [2147483647,2147483647,2147483647,-1],
//   [2147483647,-1,2147483647,-1],
//   [0,-1,2147483647,2147483647]
// ]

// Output: [
//   [3,-1,0,1],
//   [2,2,1,-1],
//   [1,-1,2,-1],
//   [0,-1,3,4]
// ]

class Solution {
  /**
   * @param {number[][]} grid
   */
  islandsAndTreasure(grid) {
    const visit = new Set();
    let rows = grid.length;
    let cols = grid[0].length;
    let q = [];

    const addRoom = (r, c) => {
      let key = `${r},${c}`;
      if (
        r < 0 ||
        c < 0 ||
        r >= rows ||
        c >= cols ||
        visit.has(key) ||
        grid[r][c] === -1
      ) {
        return;
      }
      visit.add(key);
      q.push([r, c]);
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 0) {
          q.push([r, c]);
          visit.add(`${r},${c}`);
        }
      }
    }

    let dist = 0;
    while (q.length !== 0) {
      for (let i = q.length; i > 0; i--) {
        const [r, c] = q.shift();
        grid[r][c] = dist;
        addRoom(r + 1, c);
        addRoom(r - 1, c);
        addRoom(r, c + 1);
        addRoom(r, c - 1);
      }
      dist += 1;
    }

    return grid;
  }
}
