// You are given two integer arrays preorder and inorder.

// preorder is the preorder traversal of a binary tree
// inorder is the inorder traversal of the same tree
// Both arrays are of the same size and consist of unique values.
// Rebuild the binary tree from the preorder and inorder traversals and return its root.
// Input: preorder = [1,2,3,4], inorder = [2,1,3,4]
// Output: [1,2,3,null,null,null,4]

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
   * @param {number[]} preorder
   * @param {number[]} inorder
   * @return {TreeNode}
   */
  buildTree(preorder, inorder) {
    if (!preorder.length || !inorder.length) {
      return null;
    }

    let root = new TreeNode(preorder[0]);
    let mid = inorder.indexOf(preorder[0]);
    root.left = this.buildTree(
      preorder.slice(1, mid + 1),
      inorder.slice(0, mid),
    );
    root.right = this.buildTree(
      preorder.slice(mid + 1),
      inorder.slice(mid + 1),
    );
    return root;
  }
}
