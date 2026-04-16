// group anagrams
// Input: strs = ["eat","tea","tan","ate","nat","bat"]  [1,2,3,4]
// Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

const groupAn = (arr) => {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i].split("").sort().join("");
    if (!map[str]) {
      map[str] = [arr[i]];
    } else {
      map[str].push(arr[i]);
    }
  }
  return Object.values(map);
};

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
const groupAnagrams = (strs) => {
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i),
  );
  let map = {};

  for (const str of strs) {
    let n = str.length - 1;
    let res = [];
    while (n >= 0) {
      if (!res[alphabet.indexOf(str[n])]) {
        res[alphabet.indexOf(str[n])] = str[n];
      } else {
        res[alphabet.indexOf(str[n])] =
          `${res[alphabet.indexOf(str[n])]}` + str[n];
      }
      n--;
    }
    res = res.join("");
    if (!map[res]) {
      map[res] = [str];
    } else {
      map[res].push(str);
    }
  }

  return Object.values(map);
};

console.log(groupAn(["eat", "tea", "tan", "ate", "nat", "bat"]));
