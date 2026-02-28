/**
 * Definition for singly-linked list.
 * class ListNode {
 *     constructor(val = 0, next = null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */

class Solution {
  /**
   * @param {ListNode} head
   * @return {ListNode}
   */
  reverseList(head) {
    let LL = head.next;
    let oCurrentNode = new ListNode(head.val);

    while (LL !== null) {
      console.log(LL);
      let temp = oCurrentNode;
      oCurrentNode = LL;
      oCurrentNode.next = temp;
      LL = LL.next;
    }
    return oCurrentNode;
  }
}
