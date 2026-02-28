// Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.

// Machine 1 (sender) has the function:

// Format: "length#string" for each string
// Example: ["hello", "world"] → "5#hello5#world"
const encode = (strs) => {
  let res = "";
  strs.forEach((element) => {
    res = res + element.length + "#" + element;
  });
  return res;
};

/**
 * @param {string} str
 * @returns {string[]}
 */
const decode = (str) => {
  const result = [];
  let i = 0;

  while (i < str.length) {
    // Read the length (until we hit '#')
    let j = i;
    while (str[j] !== '#') {
      j++;
    }

    const length = parseInt(str.substring(i, j), 10);

    // Extract the string of that length (starts after '#')
    const start = j + 1;
    const word = str.substring(start, start + length);
    result.push(word);

    // Move to next encoded string
    i = start + length;
  }

  return result;
};

// Test cases
console.log(encode(["hello", "world"]));              // "5#hello5#world"
console.log(decode(encode(["hello", "world"])));      // ["hello", "world"]

console.log(decode(encode(["a1b", "c2d"])));          // ["a1b", "c2d"] - handles digits!
console.log(decode(encode(["", "test", ""])));        // ["", "test", ""] - handles empty strings
console.log(decode(encode(["hello world 123"])));     // ["hello world 123"] - handles long strings
