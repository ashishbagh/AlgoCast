// Given a string s, return true if it is a palindrome, otherwise return false.
// A palindrome is a string that reads the same forward and backward. It is also case-insensitive and ignores all non-alphanumeric characters.
// Note: Alphanumeric characters consist of letters (A-Z, a-z) and numbers (0-9).

// Example 1:

// Input: s = "Was it a car or a cat I saw?"

// Output: true
// Explanation: After considering only alphanumerical characters we have "wasitacaroracatisaw", which is a palindrome.

const isPalindrome = (s) => {
  let str2 = "";
  let str = "";
  for (let i = 0; i < s.length; i++) {
    if (isValidStr(s[i])) {
      str2 = str2 + s[i].toLowerCase();
      str = s[i].toLowerCase() + str;
    }
  }
  return str === str2;
};

const isValidStr = (s) => {
  return /^[a-zA-Z0-9]+$/.test(s);
};

let s = "Was it a car or a cat I saw?";
console.log(isPalindrome(s));
