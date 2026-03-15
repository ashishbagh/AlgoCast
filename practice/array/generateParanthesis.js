class Solution {
  /**
   * @param {number} n
   * @return {string[]}
   */
  generateParenthesis(n) {
    let result = [];
    let ans = [];
    const generate = (numOpen, numClose) => {
      if (numClose === numOpen && numOpen === n) {
        ans.push(result.join(""));
        return;
      }

      if (numOpen < n) {
        result.push("(");
        generate(numOpen + 1, numClose);
        result.pop();
      }

      if (numClose < numOpen) {
        result.push(")");
        generate(numOpen, numClose + 1);
        result.pop();
      }
    };

    generate(0, 0);
    return ans;
  }
}
