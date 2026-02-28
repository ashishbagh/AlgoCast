class Solution {
  /**
   * @param {number} n
   * @param {number[][]} edges
   * @returns {boolean}
   */
  validTree(n, edges) {
    if (n === 0) return true;

    let adj = {};
    for (let i = 0; i < n; i++) {
      adj[i] = [];
    }

    for (const num in edges) {
      let [n1, n2] = edges[num];
      adj[n1].push(n2);
      adj[n2].push(n1);
    }
    let visit = new Set();
    const dfs = (i, prev) => {
      if (visit.has(i)) return false;
      visit.add(i);
      for (const j in adj[i]) {
        if (adj[i][j] === prev) continue;
        if (!dfs(adj[i][j], i)) return false;
      }
      return true;
    };

    return dfs(0, -1) && visit.size === n;
  }
}
