// Given a string s, reverse the string without reversing its individual words. Words are separated by dots(.).

// Note: The string may contain leading or trailing dots(.) or multiple dots(.) between two words. The returned string should only have a single dot(.) separating the words, and no extra dots should be included.

// Examples :

// Input: s = "i.like.this.program.very.much"
// Output: "much.very.program.this.like.i"
// Explanation: The words in the input string are reversed while maintaining the dots as separators, resulting in "much.very.program.this.like.i".
// Input: s = "..geeks..for.geeks."
// Output: "geeks.for.geeks"
// Explanation: After removing extra dots and reversing the whole string, the input string becomes "geeks.for.geeks".

const reverWord = (s) => {
  let input = [];
  input = s.split(".").reverse();
  let res = "";

  res = input.filter((element) => element !== "");
  return res.join(".");
};

console.log(reverWord("i.like.this.program.very.much"));
console.log(reverWord("..home....."));
console.log(reverWord("v.f..gfc"));

console.log("GeeksForGeeks".split("For"));
