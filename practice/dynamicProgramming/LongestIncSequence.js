// Given an integer array nums, return the length of the longest strictly increasing subsequence.
// A subsequence is a sequence that can be derived from the given sequence by deleting some or no elements without changing the relative order of the remaining characters.

// For example, "cat" is a subsequence of "crabt".
// Example 1:

// Input: nums = [9, 1, 4, 2, 3, 3, 7]
// Output: 4
// Explanation: The longest increasing subsequence is[1, 2, 3, 7], which has a length of 4.

// Example 2:
// Input: nums = [0, 3, 1, 3, 2, 3]
// Output: 4


class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    lengthOfLIS(nums) {
        let n = nums.length;
        let memo = new Array(n).fill(-1);
        const dfs = (i) => {
            if (memo[i] !== -1) return memo[i];
            let count = 1;
            for (let j = i + 1; j < n; j++) {
                if (nums[i] < nums[j]) {
                    count = Math.max(count, 1 + dfs(j));
                }
            }
            memo[i] = count;
            return count;
        }
        return Math.max(...nums.map((_, i) => dfs(i)));
    }
}
