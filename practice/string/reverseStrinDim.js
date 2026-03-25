let s = "..geeks..for.geeks.";

const reverseWords = (words) => {
  let stack = [];
  let str = "";
  for (let word of words) {
    if (word !== ".") {
      str += word;
    } else if (str.length > 0) {
      console.log(str);
      stack.push(str);
      str = "";
    }
  }
  if (str.length > 0) stack.push(str);

  return stack.reverse().join(".");
};

console.log(reverseWords(s));
let t = "..home.....";

console.log(reverseWords(t));
