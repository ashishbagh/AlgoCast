// You are given an array of integers candidates, which may contain duplicates, and a target integer target.Your task is to return a list of all unique combinations of candidates where the chosen numbers sum to target.
// Each element from candidates may be chosen at most once within a combination.The solution set must not contain duplicate combinations.
// You may return the combinations in any order and the order of the numbers in each combination can be in any order.
//     Example 1:

// Input: candidates = [9, 2, 2, 4, 6, 1, 5], target = 8
// Output: [
//     [1, 2, 5],
//     [2, 2, 4],
//     [2, 6]
// ]
// Example 2:

// Input: candidates = [1, 2, 3, 4, 5], target = 7
// Output: [
//     [1, 2, 4],
//     [2, 5],
//     [3, 4]
// ]


class Solution {
    /**
     * @param {number[]} candidates
     * @param {number} target
     * @return {number[][]}
     */
    combinationSum2(candidates, n) {
        let result = [];
        candidates = candidates.sort((a, b) => a - b);

        const dfs = (target, left, res) => {
            if (target === n) {
                result.push([...res]);
                return 1;
            }
            if (target > n) return 0;
            if (left >= candidates.length) return 0;

            for (let i = left; i < candidates.length; i++) {
                if (i > left && candidates[i] === candidates[i - 1]) {
                    continue;
                }
                res.push(candidates[i]);
                dfs(target + candidates[i], i + 1, res);
                res.pop();
            }

            return;
        }

        dfs(0, 0, []);

        return result;
    }
}
