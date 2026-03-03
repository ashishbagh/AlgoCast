class Solution {
    /**
     * @param {number} n
     * @return {number}
     */
    climbStairs(n) {
        let coins = [1, 2]; // allowed Steps
        let cache = {};

        const dfs = (target) => {
            if (target === n) return 1;
            if (target > n) return 0;

            let key = target;
            if (cache[key] !== undefined) return cache[key];

            let ways = 0;
            for (let i = 0; i < coins.length; i++) {
                ways += dfs(target + coins[i]);  // Use coin[i], can reuse (i stays)
            }
            cache[key] = ways;
            return cache[key];
        }
        return dfs(0, 0)
    }
}
