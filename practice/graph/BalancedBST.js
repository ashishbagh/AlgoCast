// Given a binary tree, return true if it is height-balanced and false otherwise.

// A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.

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
   * @return {boolean}
   */
  isBalanced(root) {
    const dfs = (root) => {
      if (!root) {
        return [true, 0];
      }

      let left = dfs(root.left);
      let right = dfs(root.right);
      let isBalanced = left[0] && right[0] && Math.abs(left[1] - right[1]) <= 1;

      return [isBalanced, 1 + Math.max(left[1], right[1])];
    };

    return dfs(root)[0];
  }
}
