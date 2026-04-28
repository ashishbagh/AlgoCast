// You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [aᵢ, bᵢ] indicates that there is an edge between aᵢ and bᵢ in the graph.
// Return the number of connected components in the graph.

// Example 1:
// Input:
// n = 5, edges = [[0,1],[1,2],[3,4]]
// Output: 2

class Solution {
  /**
   * @param {number} n
   * @param {number[][]} edges
   * @returns {number}
   */
  countComponents(n, edges) {
    const adj = {};
    for (let i = 0; i < n; i++) {
      adj[i] = [];
    }

    for (const [u, v] of edges) {
      adj[u].push(v);
      adj[v].push(u);
    }

    const visit = new Set();
    const dfs = (node) => {
      if (visit.has(node)) return;
      visit.add(node);
      for (const neighbor of adj[node]) {
        dfs(neighbor);
      }
    };

    let count = 0;
    for (let node = 0; node < n; node++) {
      if (!visit.has(node)) {
        dfs(node);
        count++;
      }
    }

    return count;
  }
}
