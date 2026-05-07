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

/** O(m*n);
 * @param {string[]} strs
 * @return {string[][]}
 */
const groupAnagrams = (strs) => {
  const map = new Map();

  for (const str of strs) {
    const count = new Array(26).fill(0);

    for (const ch of str) {
      count[ch.charCodeAt(0) - 97]++;
    }

    const key = count.join("#");

    if (!map.has(key)) {
      map.set(key, [str]);
    } else {
      map.get(key).push(str);
    }
  }

  return [...map.values()];
};

console.log(groupAn(["eat", "tea", "tan", "ate", "nat", "bat"]));
