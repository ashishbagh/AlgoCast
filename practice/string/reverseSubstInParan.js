// You are given a string s that consists of lower case English letters and brackets.

// Reverse the strings in each pair of matching parentheses, starting from the innermost one.

// Your result should not contain any brackets.

// Example 1:

// Input: s = "(abcd)"
// Output: "dcba"
// Example 2:

// Input: s = "(u(love)i)"
// Output: "iloveu"
// Explanation: The substring "love" is reversed first, then the whole string is reversed.
// Example 3:

// Input: s = "(ed(et(oc))el)"
// Output: "leetcode"
// Explanation: First, we reverse the substring "oc", then "etco", and finally, the whole string.

/**
 * @param {string} s
 * @return {string}
 */
var reverseParentheses = function (s) {
  let start = "(";
  let end = ")";

  let stack = [];
  let l = 0;
  let r = 0;
  while (l < s.length) {
    if (s[l] !== end) {
      stack.push(s[l]);
    } else {
      let temp = [];
      while (stack.length && stack[stack.length - 1] !== start) {
        temp.push(stack.pop());
      }
      stack.pop();
      for (const c of temp) {
        stack.push(c);
      }
    }
    l++;
  }

  return stack.join("");
};
