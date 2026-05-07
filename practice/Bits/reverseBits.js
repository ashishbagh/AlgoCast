// Reverse bits of a given 32 bits signed integer.
// Input: n = 43261596

// Output: 964176192

/**
 * @param {number} n
 * @return {number}
 */
var reverseBits = function (n) {
  // Convert to binary and pad to 32 bits
  let str = n.toString(2).padStart(32, "0");

  // Reverse the 32-bit string
  let reversed = str.split("").reverse().join("");

  console.log("Original:", str);
  console.log("Reversed:", reversed);

  // Convert back to number (>>> 0 ensures unsigned 32-bit)
  return parseInt(reversed, 2) >>> 0;
};

const reverseInt = (x) => {
  if (x === 0) {
    return 0;
  }

  let a = x < 1 ? -1 : 1;
  let n = x * a;
  let res = 0;
  while (n) {
    let digit = n % 10;
    n = parseInt(n / 10);
    res = res * 10 + digit;
  }

  if (2147483648 < res * a || res * a < -2147483648) {
    return 0;
  }
  return res * a;
};

console.log(reverseBits(43261596));
