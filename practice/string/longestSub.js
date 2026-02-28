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
  // code here
  let left = 0;
  let right = 1;
  let res = 0;
  let map = {};
  if (!s) {
    return s.length;
  }
  map[s[left]] = left;
  res = 1;
  while (right < s.length) {
    if (!map[s[right]]) {
      map[s[right]] = right;
      res = Math.max(res, Object.keys(map).length);
    } else {
      left = map[s[right]] + 1;
      map = {};
      map[s[left]] = left;
      right = left;
    }
    right++;
  }
  return res;
};
