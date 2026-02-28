class Solution {
    /**
     * @param {character[][]} grid
     * @return {number}
     */
    numIslands(grid) {
        let l = grid[0].length;
        let h = grid.length;
        let visited = new Array(h).fill(null).map(() => new Array(l).fill(false));
        //let visited= new Array(h).fill(Array(l).fill(false));
        console.log(visited);

        const dfs = (i, j) => {
            if (i > h || j > l || visited[i][j] || grid[i][j] !== "1" || i < 0 || j < 0) {
                return;
            }
            visited[i][j] = true;
            dfs(i + 1, j);
            dfs(i - 1, j);
            dfs(i, j + 1);
            dfs(i, j - 1);
        }

        let count = 0;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < l; j++) {
                if (grid[i][j] === "1" && !visited[i][j]) {
                    count += 1;
                    dfs(i, j);
                }
            }
        }

        return count;
    }
}
