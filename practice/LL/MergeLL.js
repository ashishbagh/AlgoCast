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
   * @param {ListNode} list1
   * @param {ListNode} list2
   * @return {ListNode}
   */
  mergeTwoLists(list1, list2) {
    let dummy = new ListNode(); // Dummy head to simplify logic
    let current = dummy;

    // Compare and take the smaller one
    while (list1 !== null && list2 !== null) {
      if (list1.val <= list2.val) {
        current.next = list1;
        list1 = list1.next; // Only advance list1
      } else {
        current.next = list2;
        list2 = list2.next; // Only advance list2
      }
      current = current.next;
    }

    // Attach remaining nodes (one list may still have elements)
    current.next = list1 !== null ? list1 : list2;

    return dummy.next; // Skip dummy, return actual head
  }
}
