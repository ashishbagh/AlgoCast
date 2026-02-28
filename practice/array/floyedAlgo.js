
// You are given an array of integers nums containing n + 1 integers. Each integer in nums is in the range [1, n] inclusive.
// Every integer appears exactly once, except for one integer which appears two or more times. Return the integer that appears more than once.
// Example 1:

// Input: nums = [1,2,3,2,2]

// Output: 2
// Example 2:

// Input: nums = [1,2,3,4,4]

// Output: 4



class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    findDuplicate(nums) {
        let slow = 0, fast = 0

        // Phase 1: Find intersection point (detect cycle)
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow !== fast);  // Continue UNTIL they meet

        // Phase 2: Find entrance to cycle (the duplicate)
        let slow2 = 0;
        while (slow !== slow2) {  // Continue UNTIL they meet
            slow = nums[slow];
            slow2 = nums[slow2];
        }

        return slow;

    }
}
