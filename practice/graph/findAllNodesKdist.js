// Given the root of a binary tree, the value of a target node target, and an integer k, return an array of the values of all nodes that have a distance k from the target node.
// You can return the answer in any order.

var distanceK = function (root, target, k) {
  const parMap = new Map();
  const parBuild = (node, par) => {
    if (!node) return;
    parMap.set(node, par);
    parBuild(node.left, node);
    parBuild(node.right, node);
  };

  parBuild(root, null);

  const visit = new Set();
  visit.add(target);

  let queue = [[target, 0]];
  let result = [];

  while (queue.length) {
    const [node, dist] = queue.shift();

    if (dist === k) {
      result.push(node.val);
    }
    if (dist > k) break;

    const neighbours = [node.left, node.right, parMap.get(node)];
    console.log(neighbours);
    for (const next of neighbours) {
      if (next && !visit.has(next)) {
        visit.add(next);
        queue.push([next, dist + 1]);
      }
    }
  }
  return result;
};
