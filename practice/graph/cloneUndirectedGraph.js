// Clone Graph
// Given a node in a connected undirected graph, return a deep copy of the graph.

// Each node in the graph contains an integer value and a list of its neighbors.

// class Node {
//     public int val;
//     public List<Node> neighbors;
// }
// The graph is shown in the test cases as an adjacency list. An adjacency list is a mapping of nodes to lists, used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.

// For simplicity, nodes values are numbered from 1 to n, where n is the total number of nodes in the graph. The index of each node within the adjacency list is the same as the node's value (1-indexed).

// The input node will always be the first node in the graph and have 1 as the value.

// Input: adjList = [[2],[1,3],[2]]

// Output: [[2],[1,3],[2]]

/**
 * // Definition for a Node.
 * class Node {
 *     constructor(val = 0, neighbors = []) {
 *       this.val = val;
 *       this.neighbors = neighbors;
 *     }
 * }
 */

class Solution {
  /**
   * @param {Node} node
   * @return {Node}
   */
  cloneGraph(node) {
    const visit = new Map();
    const dfs = (node) => {
      if (node === null) {
        return null;
      }
      if (!visit.has(node)) {
        const root = new Node(node.val);
        visit.set(node, root);
        for (const neighbor of node.neighbors) {
          root.neighbors.push(dfs(neighbor));
        }
        return root;
      } else {
        return visit.get(node);
      }
    };
    return dfs(node);
  }
}
