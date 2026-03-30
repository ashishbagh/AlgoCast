// Given an array nums of unique integers, return all possible subsets of nums.

// The solution set must not contain duplicate subsets. You may return the solution in any order.

// Example 1:

// Input: nums = [1,2,3]

// Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
class Solution {
    /**
     * @param {number[]} nums
     * @return {number[][]}
     */
    subsets(nums) {
        let result = [];

        const backtracking = (pointer, subset) => {
            if (pointer > nums.length) return;
            result.push([...subset]);
            for (let i = pointer; i < nums.length; i++) {
                subset.push(nums[i]);
                backtracking(i + 1, subset);
                subset.pop();
            }
            return;
        }

        backtracking(0, []);
        return result;
    }
}
