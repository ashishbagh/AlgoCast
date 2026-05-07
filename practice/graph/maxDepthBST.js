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
  maxDepth(root) {
    return this.dfs(root, 0)[0];
  }

  dfs(root) {
    if (!root) {
      return [0];
    }

    let left = this.dfs(root.left);
    let right = this.dfs(root.right);
    return [1 + Math.max(left, right)];
  }
}
