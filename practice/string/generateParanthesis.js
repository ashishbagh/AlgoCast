class Solution {
  /**
   * @param {number} n
   * @return {string[]}
   */
  generateParenthesis(n) {
    let ans = [];
    let res = [];
    const bt = (open, close) => {
      if (open === close && open === n) {
        ans.push(res.join(""));
        return;
      }

      if (open < n) {
        res.push("(");
        bt(open + 1, close);
        res.pop();
      }

      if (close < open) {
        res.push(")");
        bt(open, close + 1);
        res.pop();
      }
    };

    bt(0, 0);
    return ans;
  }
}
