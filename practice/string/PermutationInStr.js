// You are given two strings s1 and s2.
// Return true if s2 contains a permutation of s1, or false otherwise. That means if a permutation of s1 exists as a substring of s2, then return true.
// Both strings only contain lowercase letters.

// Example 1:
// Input: s1 = "abc", s2 = "lecabee"

// Output: true
// Explanation: The substring "cab" is a permutation of "abc" and is present in "lecabee".
// Example 2:
// Input: s1 = "abc", s2 = "lecaabee"

// Output: false

function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;

  const count1 = new Array(26).fill(0);
  const count2 = new Array(26).fill(0);

  for (const ch of s1) {
    count1[ch.charCodeAt(0) - 97]++;
  }

  let left = 0;

  for (let right = 0; right < s2.length; right++) {
    count2[s2[right].charCodeAt(0) - 97]++;

    if (right - left + 1 > s1.length) {
      count2[s2[left].charCodeAt(0) - 97]--;
      left++;
    }

    if (arraysEqual(count1, count2)) {
      return true;
    }
  }

  return false;
}

function arraysEqual(a, b) {
  for (let i = 0; i < 26; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
