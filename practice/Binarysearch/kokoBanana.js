class Solution {
  /**
   * @param {number[]} piles
   * @param {number} h
   * @return {number}
   */
  minEatingSpeed(piles, h) {
    let left = 1;
    let right = Math.max(...piles);
    let res = right;

    const speed = (left, right) => {
      if (left > right) return;
      let count = 0;
      let mid = parseInt((left + right) / 2);
      for (const pile of piles) {
        count += Math.ceil(pile / mid);
      }

      if (count <= h) {
        res = Math.min(res, mid);
        right = mid - 1;
      } else {
        left = mid + 1;
      }
      return speed(left, right);
    };

    speed(left, right);

    return res;
  }
}
