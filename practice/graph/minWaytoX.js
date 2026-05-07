const findMinPath = (playground) => {
  let rows = playground.length;
  let cols = playground[0].length;
  let minCount = Infinity;
  const dir = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const dfs = (r, c, visit, steps) => {
    let key = `${r},${c}`;
    if (
      r >= rows ||
      c >= cols ||
      r < 0 ||
      c < 0 ||
      visit.has(key) ||
      playground[r][c] === 0
    ) {
      return;
    }
    visit.add(key);
    if (playground[r][c] === "X") {
      minCount = Math.min(minCount, steps);
      return;
    }
    for (const [dr, dc] of dir) {
      dfs(r + dr, c + dc, visit, steps + 1);
    }
    return;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (playground[r][c] === "S") {
        for (const [dr, dc] of dir) {
          dfs(r + dr, c + dc, new Set(), 0);
        }
      }
    }
  }

  return minCount;
};

const playground = [
  ["S", 1, 1, 1, "X"],
  [1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0],
  [1, 1, 1, 1, 0],
];

const playground1 = [
  [0, 1, 1, 1, "X"],
  [1, 0, "S", 1, 0],
  [1, 0, 0, 1, 0],
  [1, 1, 1, 1, 0],
];

console.log(findMinPath(playground1));
