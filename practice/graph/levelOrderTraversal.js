/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     constructor(val = 0, left = null, right = null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

class Solution {
  /**
   * @param {TreeNode} root
   * @return {number[][]}
   */
  levelOrder(root) {
    let result = new Map();
    const bfs = (root, level) => {
      if (!root) {
        return;
      }
      let res = [];
      res.push(root.val);

      if (!result.get(level)) {
        result.set(level, res);
      } else {
        result.set(level, [...result.get(level), ...res]);
      }

      level++;
      bfs(root.left, level);
      bfs(root.right, level);
    };

    bfs(root, 0);

    let res = [];
    for (const arr of result.values()) {
      res.push(arr);
    }
    return res;
  }
}
