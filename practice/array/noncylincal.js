// A non-cyclical number is an integer defined by the following algorithm:

// Given a positive integer, replace it with the sum of the squares of its digits.
// Repeat the above step until the number equals 1, or it loops infinitely in a cycle which does not include 1.
// If it stops at 1, then the number is a non-cyclical number.
// Given a positive integer n, return true if it is a non-cyclical number, otherwise return false.

class Solution {
  /**
   * @param {number} n
   * @return {boolean}
   */
  isHappy(n) {
    let t = n + "";
    let visit = new Set();
    const recur = (num) => {
      if (visit.has(num)) return false;
      if (num === 1) return true;
      let res = 0;
      let str = num + "";
      for (let i = 0; i < str.length; i++) {
        let prd = parseInt(str[i]) * parseInt(str[i]);
        res += prd;
      }
      visit.add(num);
      return recur(res);
    };
    return recur(n);
  }
}
