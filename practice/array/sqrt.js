class Solution {
  /**
   * @param {number} x
   * @return {number}
   */
  mySqrt(x) {
    if (x === 0) return 0;
    let res = 0;
    let l = 0;
    let r = x;

    while (l <= r) {
      let m = parseInt((l + r) / 2);
      if (m * m > x) {
        r = m - 1;
      } else if (m * m < x) {
        l = m + 1;
        res = m;
      } else {
        return m;
      }
    }
    return res;
  }
}
