// Given a binary tree, return true if it is height-balanced and false otherwise.
// A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.

// Example 1:
// Input: root = [1,2,3,null,null,4]

// Output: true

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
  DFS(root) {
    if (!root) {
      return [true, 0];
    }

    let left = this.DFS(root.left);
    let right = this.DFS(root.right);
    let isBalanced = left[0] && right[0] && Math.abs(left[1] - right[1]) <= 1;
    return [isBalanced, 1 + Math.max(left[1], right[1])];
  }
  /**
   * @param {TreeNode} root
   * @return {boolean}
   */
  isBalanced(root) {
    return this.DFS(root)[0];
  }
}
