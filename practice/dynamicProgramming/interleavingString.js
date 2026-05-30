// You are given three strings s1, s2, and s3. Return true if s3 is formed by interleaving s1 and s2 together or false otherwise.

// Interleaving two strings s and t is done by dividing s and t into n and m substrings respectively, where the following conditions are met

// |n - m| <= 1, i.e. the difference between the number of substrings of s and t is at most 1.
// s = s1 + s2 + ... + sn
// t = t1 + t2 + ... + tm
// Interleaving s and t is s1 + t1 + s2 + t2 + ... or t1 + s1 + t2 + s2 + ...
// You may assume that s1, s2 and s3 consist of lowercase English letters.

// Input: ((s1 = "aaaa"), (s2 = "bbbb"), (s3 = "aabbbbaa"));
// Output: true;

// Input: s1 = "", s2 = "", s3 = ""
// Output: true

// Input: s1 = "abc", s2 = "xyz", s3 = "abxzcy"
// Output: false

class Solution {
  /**
   * @param {string} s1
   * @param {string} s2
   * @param {string} s3
   * @return {boolean}
   */
  isInterleave(s1, s2, s3) {
    if (s1.length + s2.length !== s3.length) return false;
    let cache = new Map();
    const dfs = (l, r) => {
      let key = `${l},${r}`;
      let ans = false;
      let i = l + r;
      if (i > s3.length) return true;
      if (cache.has(key)) return cache.get(key);
      if (s3[i] === s1[l] && s3[i] === s2[r]) {
        ans = dfs(l + 1, r) || dfs(l, r + 1);
      } else if (s3[i] === s2[r]) {
        ans = dfs(l, r + 1);
      } else if (s3[i] === s1[l]) {
        ans = dfs(l + 1, r);
      }
      cache.set(key, ans);
      return ans;
    };

    return dfs(0, 0);
  }
}
