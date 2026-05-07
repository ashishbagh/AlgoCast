// You are given two strings num1 and num2 that represent non-negative integers.

// Return the product of num1 and num2 in the form of a string.

// Assume that neither num1 nor num2 contain any leading zero, unless they are the number 0 itself.

// Note: You can not use any built-in library to convert the inputs directly into integers.

// Example 1:

// Input: num1 = "3", num2 = "4"

// Output: "12"

class Solution {
  /**
   * @param {string} num1
   * @param {string} num2
   * @return {string}
   */
  multiply(num1, num2) {
    if (num1 === "0" || num2 === "0") return "0";
    let res = new Array(num1.length + num2.length).fill(0);
    for (let i = num1.length - 1; i >= 0; i--) {
      for (let j = num2.length - 1; j >= 0; j--) {
        let p1 = i + j; //carry
        let p2 = i + j + 1; // actual
        let mul = (num1[i] - "0") * (num2[j] - "0");
        let sum = mul + res[p2];
        res[p2] = sum % 10;
        res[p1] += Math.floor(sum / 10);
      }
    }

    while (res[0] === 0) {
      res.shift();
    }

    return res.join("");
  }
}
