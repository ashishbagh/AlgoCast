// You are given a connected undirected graph with n nodes labeled from 1 to n. Initially, it contained no cycles and consisted of n-1 edges.
// We have now added one additional edge to the graph. The edge has two different vertices chosen from 1 to n, and was not an edge that previously existed in the graph.
// The graph is represented as an array edges of length n where edges[i] = [ai, bi] represents an edge between nodes ai and bi in the graph.
// Return an edge that can be removed so that the graph is still a connected non-cyclical graph. If there are multiple answers, return the edge that appears last in the input edges.

// Example 1:
// Input: edges = [[1,2],[1,3],[3,4],[2,4]]
// Output: [2,4]

// idea is to find all the adjacent list {1:[2,3],2:[1,4],3:[1,4],4:[2,3]}; 
// and check if e.g  [1,2] 1--->2 reach 2 using neibhours if yes than 1,2 is redundant

class Solution {
  /**
   * @param {number[][]} edges
   * @return {number[]}
   */
  findRedundantConnection(edges) {
    let n = edges.length;
    let adj = new Map();

    const isReachable = (start, target, visited) => {
      if (start === target) return true;

      visited.add(start);

      let neighbours = adj.get(start);

      for (const neighbour of neighbours) {
        if (!visited.has(neighbour)) {
          if (isReachable(neighbour, target, visited)) return true;
        }
      }
      return false;
    };

    for (const edge of edges) {
      let [u, v] = edge;

      if (adj.has(u) && adj.has(u)) {
        if (isReachable(u, v, new Set())) {
          return [u, v];
        }
      }

      if (!adj.has(u)) adj.set(u, []);
      if (!adj.has(v)) adj.set(v, []);
      adj.get(u).push(v);
      adj.get(v).push(u);
    }
  }
}
