// Given a string s, the objective is to convert it into integer format without utilizing any built-in functions. Refer the below steps to know about atoi() function.

// Cases for atoi() conversion:

// Skip any leading whitespaces.
// Check for a sign (‘+’ or ‘-‘), default to positive if no sign is present.
// Read the integer by ignoring leading zeros until a non-digit character is encountered or end of the string is reached. If no digits are present, return 0.
// If the integer is greater than 231 – 1, then return 231 – 1 and if the integer is smaller than -231, then return -231.
// Examples:

// Input: s = "-123"
// Output: -123
// Explanation: It is possible to convert -123 into an integer so we returned in the form of an integer
// Input: s = "  -"
// Output: 0
// Explanation: No digits are present, therefore the returned answer is 0.
// Input: s = " 1231231231311133"
// Output: 2147483647
// Explanation: The converted number will be greater than 231 – 1, therefore print 231 – 1 = 2147483647.

const atoi = (s) => {
  const map = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
  };
  let res = "";
  let count = 1;

  if ((s.length === 1 && s === "-") || s === "+") {
    return 0;
  }

  for (let i = 0; i < s.length; i++) {
    if (s[i] === " ") {
      continue;
    }
    if (s[i] === "-" && res.length === 0) {
      count = -1;
      continue;
    }

    if (res.length === 0 && s[i] === "0") {
      continue;
    }
    if (map[s[i]] === undefined) {
      i = s.length;
      continue;
    }
    res += s[i];
  }

  if (res == 0) {
    return 0;
  }
  let result = res * count;

  if (result > 2147483647) {
    return 2147483647;
  }

  if (result < -2147483648) {
    return -2147483648;
  }

  return res * count;
};

console.log(atoi("21474836460"));
