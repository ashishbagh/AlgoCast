// Given an array nums of unique integers, return all the possible permutations.You may return the answer in any order.

//     Example 1:

// Input: nums = [1, 2, 3]

// Output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]


class Solution {
    /**
     * @param {number[]} nums
     * @return {number[][]}
     */
    permute(nums) {
        let result = [];
        let booArr = new Array(nums.length).fill(false);

        const backtracking = (subset, decision) => {
            if (subset.length === nums.length) {
                result.push([...subset]);
                return;
            }
            for (let i = 0; i < nums.length; i++) {
                if (decision[i]) continue;
                subset.push(nums[i]);
                decision[i] = true;
                backtracking(subset, decision);
                subset.pop();
                decision[i] = false;
            }
            return;
        }

        backtracking([], [...booArr]);
        return result;
    }
}
