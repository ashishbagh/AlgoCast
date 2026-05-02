class Solution {
  generateParenthesis(n) {
    const result = [];
    const path = [];

    const backtrack = (open, close) => {
      if (open === n && close === n) {
        result.push(path.join(""));
        return;
      }

      if (open < n) {
        path.push("(");
        backtrack(open + 1, close);
        path.pop();
      }

      if (close < open) {
        path.push(")");
        backtrack(open, close + 1);
        path.pop();
      }
    };

    backtrack(0, 0);
    return result;
  }
}
