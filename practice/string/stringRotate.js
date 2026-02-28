// Strings Rotations of Each Other
// Difficulty: MediumAccuracy: 43.83%Submissions: 343K+Points: 4Average Time: 15m
// You are given two strings s1 and s2, of equal lengths. The task is to check if s2 is a rotated version of the string s1.

// Note: A string is a rotation of another if it can be formed by moving characters from the start to the end (or vice versa) without rearranging them.

// Examples :

// Input: s1 = "abcd", s2 = "cdab"
// Output: true
// Explanation: After 2 right rotations, s1 will become equal to s2.
// Input: s1 = "aab", s2 = "aba"
// Output: true
// Explanation: After 1 left rotation, s1 will become equal to s2.
// Input: s1 = "abcd", s2 = "acbd"
// Output: false
// Explanation: Strings are not rotations of each other.

const areRotations = (s1, s2) => {
  let newS1 = s1 + s1;
  return newS1.split(s2).length > 1;
};

let s1 = "abcd",
  s2 = "cdab";
console.log(areRotations(s1, s2));
