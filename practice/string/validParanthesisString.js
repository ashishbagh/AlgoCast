// You are given a string s which contains only three types of characters: '(', ')' and '*'.

// Return true if s is valid, otherwise return false.

// A string is valid if it follows all of the following rules:

// Every left parenthesis '(' must have a corresponding right parenthesis ')'.
// Every right parenthesis ')' must have a corresponding left parenthesis '('.
// Left parenthesis '(' must go before the corresponding right parenthesis ')'.
// A '*' could be treated as a right parenthesis ')' character or a left parenthesis '(' character, or as an empty string "".
// Example 1:

// Input: s = "((**)"

// Output: true

class Solution {
  /**
   * @param {string} s
   * @return {boolean}
   */
  checkValidString(s) {
    let star = [];
    let stack = [];

    for (let i = 0; i < s.length; i++) {
      let str = s[i];
      if (str === "(") {
        stack.push(i);
      } else if (str === "*") {
        star.push(i);
      } else {
        if (stack.length > 0) {
          stack.pop();
        } else if (star.length > 0) {
          star.pop();
        } else {
          return false;
        }
      }
    }

    while (stack.length > 0 && star.length > 0) {
      if (stack.pop() > star.pop()) return false;
    }

    return stack.length === 0;
  }
}
