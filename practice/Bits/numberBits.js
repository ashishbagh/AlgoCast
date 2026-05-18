// You are given an unsigned integer n. Return the number of 1 bits in its binary representation.

// You may assume n is a non-negative integer which fits within 32-bits.

// Example 1:

// Input: n = 00000000000000000000000000010111

// Output: 4

class Solution {
  /**
   * @param {number} n - a positive integer
   * @return {number}
   */
  hammingWeight(n) {
    let strs = n.toString(2);
    let res = 0;

    for (const str of strs) {
      if (str === "1") res += 1;
    }
    return res;
  }
}
