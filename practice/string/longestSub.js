// You are given a string s. You have to find the length of the longest substring with all distinct characters.

// Examples:

// Input: s = "geeksforgeeks"
// Output: 7
// Explanation: "eksforg" is the longest substring with all distinct characters.
// Input: s = "aaa"
// Output: 1
// Explanation: "a" is the longest substring with all distinct characters.
// Input: s = "abcdefabcbb"
// Output: 6
// Explanation: The longest substring with all distinct characters is "abcdef", which has a length of 6.

const longestUniqueSubstr = (s) => {
  if (!s) {
    return s.length;
  }
  let map = new Map();
  let r = 0;
  let l = 0;
  let max = 1;
  while (r < s.length) {
    if (map.has(s[r]) && map.get(s[r]) >= l) {
      l = map.get(s[r]) + 1;
    }
    map.set(s[r], r);
    max = Math.max(max, r - l + 1);
    r++;
  }
  return max;
};
