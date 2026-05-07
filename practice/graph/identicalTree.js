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
   * @param {TreeNode} p
   * @param {TreeNode} q
   * @return {boolean}
   */
  isSameTree(p, q) {
    //your code here
    if (p === null && q === null) {
      return true;
    }

    if ((p === null && q !== null) || (p !== null && q === null)) {
      return false;
    }

    return (
      p.val === q.val &&
      this.isSameTree(p.left, q.left) &&
      this.isSameTree(p.right, q.right)
    );
  }
}
