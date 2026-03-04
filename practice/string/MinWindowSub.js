class Solution {
  /**
   * @param {string} s
   * @param {string} t
   * @return {string}
   */
  minWindow(s, t) {
    if (t.length > s.length) return "";

    const need = new Map();
    for (const c of t) {
      need.set(c, (need.get(c) || 0) + 1);
    }

    const window = new Map();
    let valid = 0;
    let minLen = Infinity;

    let result = "";
    let left = 0;
    let right = 0;
    while (right < s.length) {
      let c = s[right];
      window.set(c, (window.get(c) || 0) + 1);
      // Check if this char satisfies its requirement
      if (need.has(c) && window.get(c) === need.get(c)) {
        valid++;
      }

      while (valid === need.size) {
        if (right - left + 1 < minLen) {
          minLen = right - left + 1;
          result = s.substring(left, right + 1);
        }
        let l = s[left];
        window.set(l, window.get(l) - 1);
        if (need.has(l) && window.get(l) < need.get(l)) {
          valid--;
        }
        left++;
      }

      right++;
    }

    return result;
  }
}
