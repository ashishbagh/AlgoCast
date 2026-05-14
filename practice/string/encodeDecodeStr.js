class Solution {
  /**
   * @param {string[]} strs
   * @returns {string}
   */
  encode(strs) {
    let res = "";
    strs.forEach((s) => {
      res += s.length + "#" + s;
    });
    console.log(res);
    return res;
  }

  /**
   * @param {string} str
   * @returns {string[]}
   */
  decode(str) {
    const result = [];
    const recurse = (word, i) => {
      if (i >= str.length) return;
      let j = i;
      while (word[j] !== "#") {
        j++;
      }

      let len = parseInt(word.slice(i, j));
      let slice = word.slice(j + 1, j + 1 + len);
      result.push(slice);
      let next = j + len + 1;
      recurse(word, next);
    };

    recurse(str, 0);

    return result;
  }
}
