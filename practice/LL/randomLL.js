// class Node {
//   constructor(val, next = null, random = null) {
//       this.val = val;
//       this.next = next;
//       this.random = random;
//   }
// }

class Solution {
  /**
   * @param {Node} head
   * @return {Node}
   */
  copyRandomList(head) {
    let map = new Map();
    // edge case for null pointers
    map.set(null, null);
    let oCurrentNode = head;
    while (oCurrentNode !== null) {
      let copy = new Node(oCurrentNode.val);
      map.set(oCurrentNode, copy);
      oCurrentNode = oCurrentNode.next;
    }

    oCurrentNode = head;
    while (oCurrentNode !== null) {
      let copy = map.get(oCurrentNode);
      copy.next = map.get(oCurrentNode.next);
      copy.random = map.get(oCurrentNode.random);
      oCurrentNode = oCurrentNode.next;
    }

    return map.get(head);
  }
}
