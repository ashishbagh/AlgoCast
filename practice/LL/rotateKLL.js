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
     * @param {number} k
     * @return {ListNode}
     */
    reverseKGroup(head, k) {
        let arr = [];

        let currentNode = head;

        while (currentNode !== null) {
            arr.push(currentNode);
            let tempNode = currentNode.next;
            currentNode.next = null;
            currentNode = tempNode;
        }

        const reverse = (left, right) => {
            while (left < right) {
                [arr[left], arr[right]] = [arr[right], arr[left]];
                left++;
                right--;
            }
            return;
        };

        let left = 0;
        // reverse in groups of k
        while (left + k - 1 < arr.length) {
            reverse(left, left + k - 1);
            left = left + k;
        }

        let dummyNode = new ListNode();
        currentNode = dummyNode;
        while (arr.length !== 0) {
            currentNode.next = arr.shift();
            currentNode = currentNode.next;
        }
        return dummyNode.next;

    }
    reverseKGroupOp(head, k) {
        if (!head || k === 1) return head;

        // Dummy node to handle edge cases
        let dummy = new ListNode(0);
        dummy.next = head;

        let prevGroupEnd = dummy;
        let curr = head;

        while (true) {
            // Check if there are k nodes left
            let groupStart = curr;
            let count = 0;
            while (curr && count < k) {
                curr = curr.next;
                count++;
            }

            // If less than k nodes remain, don't reverse (keep as is)
            if (count < k) break;

            // Reverse k nodes starting from groupStart
            let prev = null;
            let node = groupStart;
            for (let i = 0; i < k; i++) {
                let next = node.next;
                node.next = prev;
                prev = node;
                node = next;
            }

            // Connect with previous part
            // prev is now the new head of reversed group
            // groupStart is now the tail of reversed group
            prevGroupEnd.next = prev;
            groupStart.next = curr;  // Connect to next group (or null)

            // Move prevGroupEnd to end of current group
            prevGroupEnd = groupStart;
        }

        return dummy.next;
    }
}




