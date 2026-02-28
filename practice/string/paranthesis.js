// Given a string s, composed of different combinations of '(' , ')', '{', '}', '[', ']'. Determine whether the Expression is balanced or not.
// An expression is balanced if:

// Each opening bracket has a corresponding closing bracket of the same type.
// Opening brackets must be closed in the correct order.
// Examples :

// Input: s = "[{()}]"
// Output: true
// Explanation: All the brackets are well-formed.

const paranCheck = (s) => {
  const closeBrac = { "]": "[", "}": "{", ")": "(" };
  const stack = [];

  for (let i = 0; i < s.length; i++) {
    if (!closeBrac[s[i]]) {
      stack.push(s[i]);
    } else {
      if (stack[stack.length - 1] === closeBrac[s[i]]) {
        stack.pop();
      } else {
        stack.push(s[i]);
      }
    }
  }

  return stack.length === 0;
};

console.log(paranCheck("}}"));

// console.log(paranCheck("{[("));
