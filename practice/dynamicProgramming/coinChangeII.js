class Solution {
    /**
     * @param {number} amount
     * @param {number[]} coins
     * @return {number}
     */
    change(amount, coins) {
        let cache = {};

        const dfs = (target, left) => {
            if (target === amount) return 1;
            if (target > amount) return 0;

            if (left >= coins.length) return 0;

            let key = `${target}${left}`
            if (cache[key] !== undefined) return cache[key];

            let ways = 0;
            // Loop through all coins from startIndex onwards
            for (let i = left; i < coins.length; i++) {
                ways += dfs(target + coins[i], i);  // Use coin[i], can reuse (i stays)
            }

            cache[key] = ways;
            return cache[key];
        }

        return dfs(0, 0)
    }
}
