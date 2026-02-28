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
