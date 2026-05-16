// You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must take course b first if you want to take course a.

// For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.
// There are a total of numCourses courses you are required to take, labeled from 0 to numCourses - 1.

// Return a valid ordering of courses you can take to finish all courses. If there are many valid answers, return any of them. If it's not possible to finish all courses, return an empty array.

// Example 1:

// Input: numCourses = 3, prerequisites = [[1,0]]

// Output: [0,1,2]

class Solution {
  /**
   * @param {number} numCourses
   * @param {number[][]} prerequisites
   * @return {number[]}
   */
  findOrder(numCourses, prerequisites) {
    const adj = {};
    for (let i = 0; i < numCourses; i++) {
      adj[i] = [];
    }
    for (const [c, p] of prerequisites) {
      adj[c].push(p);
    }

    let result = [];
    let memo = new Map();
    const dfs = (i, visit) => {
      if (memo.has(i)) return memo.get(i);
      if (visit.has(i)) return false;
      visit.add(i);
      const preqs = adj[i];
      memo.set(
        i,
        preqs.every((j) => dfs(j, visit)),
      );
      visit.delete(i);
      result.push(i);
      return memo.get(i);
    };

    for (let i = 0; i < numCourses; i++) {
      let visit = new Set();
      if (!dfs(i, visit)) return [];
    }
    return result;
  }
}
