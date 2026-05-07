// The diameter of a binary tree is defined as the length of the longest path between any two nodes within the tree. The path does not necessarily have to pass through the root.

// The length of a path between two nodes in a binary tree is the number of edges between the nodes. Note that the path can not include the same node twice.

// Given the root of a binary tree root, return the diameter of the tree.

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
  diameterOfBinaryTree(root) {
    let res = 0;
    const dfs = (root) => {
      if (!root) {
        return 0;
      }

      let left = dfs(root.left);
      let right = dfs(root.right);

      res = Math.max(res, left + right);

      return 1 + Math.max(left, right);
    };

    dfs(root);

    return res;
  }
}
