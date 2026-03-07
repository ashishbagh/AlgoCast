// You are given a weighted directed graph, represented by an adjacency matrix, dist[][] of size n x n, where dist[i][j] represents the weight of the edge from node i to node j. If there is no direct edge, dist[i][j] is set to a large value (i.e., 108) to represent infinity.
// The graph may contain negative edge weights, but it does not contain any negative weight cycles.

// Your task is to find the shortest distance between every pair of nodes i and j in the graph.

// Note: Modify the distances for every pair in place.

// Examples :

// Input: dist[][] = [[0, 4, 108, 5, 108], [108, 0, 1, 108, 6], [2, 108, 0, 3, 108], [108, 108, 1, 0, 2], [1, 108, 108, 4, 0]]

// Output: [[0, 4, 5, 5, 7], 
//          [3, 0, 1, 4, 6], 
//          [2, 6, 0, 3, 5], 
//          [3, 7, 1, 0, 2], [1, 5, 5, 4, 0]]

/**
 * @param {number[][]} matrix
 * @returns {number}
 */

class Solution {
  floydWarshall(dist) {
    // code here
    let n = dist[0].length;

    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] != 1e8 && dist[k][j] != 1e8) {
            dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
          }
        }
      }
    }

    return dist;
  }
}
