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
