// You are given an array of strings tokens that represents a valid arithmetic expression in Reverse Polish Notation.
// Return the integer that represents the evaluation of the expression.

// The operands may be integers or the results of other operations.
// The operators include '+', '-', '*', and '/'.
// Assume that division between integers always truncates toward zero.
// Example 1:

// Input: tokens = ["1","2","+","3","*","4","-"]

// Output: 5

// Explanation: ((1 + 2) * 3) - 4 = 5

class Solution {
  /**
   * @param {string[]} tokens
   * @return {number}
   */
  evalRPN(tokens) {
    let operandMap = ["+", "-", "*", "/"];
    const stack = [];
    for (const token of tokens) {
      if (operandMap.includes(token)) {
        const b = stack.pop();
        const a = stack.pop();

        if (token === "+") stack.push(a + b);
        else if (token === "-") stack.push(a - b);
        else if (token === "*") stack.push(a * b);
        else if (token === "/") stack.push(Math.trunc(a / b)); // truncate toward zero
      } else {
        stack.push(parseInt(token));
      }
    }

    return stack[0];
  }
}
