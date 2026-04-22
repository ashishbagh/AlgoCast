class Solution {
  /**
   * @param {string} s
   * @param {string[]} wordDict
   * @return {boolean}
   */
  wordBreak(s, wordDict) {
    let result = [];
    const wordSet = new Set(wordDict); // O(1) lookup instead of O(n) array scan
    const memo = new Set(); // cache dead-end strings

    const backtrack = (currStr) => {
      if (result.length > 0) return;
      if (currStr === s) {
        result.push(s);
        return;
      }
      if (currStr.length >= s.length) return;
      if (memo.has(currStr)) return; // already a dead end, skip
      if (!s.startsWith(currStr)) return; // currStr doesn't match s prefix, prune

      for (const word of wordSet) {
        let temp = currStr + word;
        if (temp.length > s.length) continue;
        backtrack(temp);
      }

      memo.add(currStr); // mark as dead end
    };

    backtrack("");
    return result.length > 0;
  }
}

// better indexing approach

const dfs = (i) => {
  if (i === s.length) return true;
  if (memo.has(i)) return memo.get(i);

  for (const word of words) {
    if (s.startsWith(word, i) && dfs(i + word.length)) {
      memo.set(i, true);
      return true;
    }
  }

  memo.set(i, false);
  return false;
};

class Solution {
  /**
   * @param {string} s
   * @param {string[]} wordDict
   * @return {boolean}
   */
  wordBreak(s, wordDict) {
    let result = [];
    const wordSet = new Set(wordDict); // O(1) lookup instead of O(n) array scan
    const memo = new Set(); // cache dead-end strings

    const backtrack = (currStr) => {
      if (result.length > 0) return;
      if (currStr === s) {
        result.push(s);
        return;
      }
      if (currStr.length >= s.length) return;
      if (memo.has(currStr)) return; // already a dead end, skip
      if (!s.startsWith(currStr)) return; // currStr doesn't match s prefix, prune

      for (const word of wordSet) {
        let temp = currStr + word;
        if (temp.length > s.length) continue;
        backtrack(temp);
      }

      memo.add(currStr); // mark as dead end
    };

    backtrack("");
    return result.length > 0;
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
      if (s.startsWith(word, i) && dfs(i + word.length)) {
        memo.set(i, true);
        return true;
      }
    }

    memo.set(i, false);
    return false;
  };

  dfs("");
  return result.length > 0;
};
