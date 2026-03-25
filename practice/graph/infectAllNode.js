// you are given a m x n grid representing a network of connected computers.
// Each cell in the grid represents a computer.
// A value of:
// 1 means the computer is infected with a virus.
// 0 means the computer is not infected.
// The virus spreads to all adjacent computers (up, down, left, right) in exactly 1 second.
// Write a function to determine the time in seconds required to infect the entire grid.

// grid = [
//   [1,0,0],
//   [0,0,0],
//   [0,0,0]
// ]

const totalInfTime = (grid) => {
  let rows = grid.length;
  let cols = grid[0].length;

  let arr = [[0, 0]];

  const dfs = (r, c, tem = []) => {
    if (r + 1 < rows && grid[r + 1][c] !== 1) {
      grid[r + 1][c] = 1;
      tem.push([r + 1, c]);
    }
    if (r - 1 > 0 && grid[r - 1][c] !== 1) {
      grid[r - 1][c] = 1;
      tem.push([r - 1, c]);
    }
    if (c + 1 < cols && grid[r][c + 1] !== 1) {
      grid[r][c + 1] = 1;
      tem.push([r, c + 1]);
    }
    if (c - 1 > 0 && grid[r][c - 1] !== 1) {
      grid[r][c - 1] = 1;
      tem.push([r, c - 1]);
    }
    return tem;
  };

  let count = 0;
  while (arr.length !== 0) {
    let temp = [];
    while (arr.length !== 0) {
      let [r, c] = arr.pop();
      temp = dfs(r, c, temp); // [0,0]
    }
    arr = temp;
    if (arr.length > 0) count += 1;
  }

  return count;
};

grid = [
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
console.log(totalInfTime(grid));
