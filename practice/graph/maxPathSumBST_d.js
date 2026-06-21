function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;

    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);

    const currentPathSum = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, currentPathSum);

    return node.val + Math.max(leftGain, rightGain);
  }

  dfs(root);
  return maxSum;
}
