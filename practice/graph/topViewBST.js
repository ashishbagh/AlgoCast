function topView(root) {
  if (!root) return [];

  const obj = {};

  function dfs(node, hd, level) {
    if (!node) return;

    if (!(hd in obj) || level < obj[hd].level) {
      obj[hd] = { val: node.val, level: level };
    }

    dfs(node.left, hd - 1, level + 1);
    dfs(node.right, hd + 1, level + 1);
  }

  dfs(root, 0, 0);

  const keys = Object.keys(obj)
    .map(Number)
    .sort((a, b) => a - b);
  return keys.map((hd) => obj[hd].val);
}
