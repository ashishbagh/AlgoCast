// Given a string s without spaces, the task is to remove all duplicate characters from it, keeping only the first occurrence.

// Note: The original order of characters must be kept the same.

// Examples :

// Input: s = "zvvo"
// Output: "zvo"
// Explanation: Only keep the first occurrence

const removeDup = (s) => {
  const map = {};
  for (let i = 0; i < s.length; i++) {
    if (!map[s[i]]) {
      map[s[i]] = s[i];
    }
  }
  return Object.values(map).join("");
};

console.log(removeDup("zvvo"));
