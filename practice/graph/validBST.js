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
  isValidBST(root) {
    const checkBST = (root, left, right) => {
      if (!root) {
        return true;
      }

      if (!(left < root.val && right > root.val)) return false;

      return (
        checkBST(root.left, left, root.val) &&
        checkBST(root.right, root.val, right)
      );
    };

    return checkBST(root, -Infinity, Infinity);
  }
}
