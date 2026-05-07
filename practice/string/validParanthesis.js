class Solution {
  /**
   * @param {string} s
   * @return {boolean}
   */
  isValid(s) {
    const map = new Map([
      ["]", "["],
      ["}", "{"],
      [")", "("],
    ]);

    let stack = [];
    for (const str of s) {
      if (!map.has(str)) {
        stack.push(str);
      } else {
        let latestStr = stack.pop();
        if (latestStr !== map.get(str)) return false;
      }
    }

    return stack.length === 0;
  }
}
