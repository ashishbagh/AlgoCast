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
   * @return {number}
   */
  goodNodes(root) {
    const result = [];

    const bfs = (root, maxVal) => {
      if (!root) {
        return;
      }

      let val = root.val;

      if (val >= maxVal) result.push(val);

      bfs(root.left, Math.max(maxVal, val));
      bfs(root.right, Math.max(maxVal, val));
    };

    bfs(root, -Infinity);

    return result.length;
  }
}
