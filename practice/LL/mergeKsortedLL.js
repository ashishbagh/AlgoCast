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
   * @param {ListNode[]} lists
   * @return {ListNode}
   */
  mergeKLists(lists) {
    let dummyNode = new ListNode();
    let oCurrentNode = dummyNode;
    let res = lists[0];
    for (let i = 1; i < lists.length; i++) {
      let oCurrentLeft = res;
      let oCurrentRight = lists[i];
      while (oCurrentLeft !== null && oCurrentRight !== null) {
        if (oCurrentLeft.val < oCurrentRight.val) {
          oCurrentNode.next = new ListNode(oCurrentLeft.val);
          oCurrentLeft = oCurrentLeft.next;
        } else {
          oCurrentNode.next = new ListNode(oCurrentRight.val);
          oCurrentRight = oCurrentRight.next;
        }
        oCurrentNode = oCurrentNode.next;
      }

      while (oCurrentRight !== null) {
        oCurrentNode.next = new ListNode(oCurrentRight.val);
        oCurrentRight = oCurrentRight.next;
        oCurrentNode = oCurrentNode.next;
      }

      while (oCurrentLeft !== null) {
        oCurrentNode.next = new ListNode(oCurrentLeft.val);
        oCurrentLeft = oCurrentLeft.next;
        oCurrentNode = oCurrentNode.next;
      }

      res = dummyNode.next;
      dummyNode = new ListNode();
      oCurrentNode = dummyNode;
    }

    return res;
  }
}
