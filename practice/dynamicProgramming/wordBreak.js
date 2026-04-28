class Solution {
  /**
   * @param {string} s
   * @param {string[]} wordDict
   * @return {boolean}
   */
  wordBreak(s, wordDict) {
    let words = new Set(wordDict);
    let memo = new Set();
    const bt = (curr) => {
      if (curr === s) {
        memo.add(curr);
        return true;
      }
      if (!s.startsWith(curr)) return false;
      if (memo.has(curr)) return false;
      if (curr.length > s.length) return false;
      for (const word of words) {
        if (bt(curr + word)) return true;
      }
      memo.add(curr);
      return false;
    };
    return bt("");
  }
}

// better indexing approach
const wordBreak = (s, wordDict) => {
  let result = [];
  const wordSet = new Set(wordDict); // O(1) lookup instead of O(n) array scan
  const memo = new Set(); // cache dead-end strings
  const dfs = (i) => {
    if (i === s.length) return true;
    if (memo.has(i)) return memo.get(i);
    for (const word of words) {
      // - >
      if (s.startsWith(word, i) && dfs(i + word.length)) {
        memo.set(i, true);
        return true;
      }
    }
    memo.set(i, false);
    return false;
  };

  return dfs("");
};
