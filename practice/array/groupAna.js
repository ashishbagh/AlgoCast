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

console.log(groupAn(["eat", "tea", "tan", "ate", "nat", "bat"]));
