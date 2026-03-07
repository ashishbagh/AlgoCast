class Solution {
  /**
   * @param {number[]} weights
   * @param {number} days
   * @return {number}
   */
  shipWithinDays(weights, days) {
    let left = Math.max(...weights);
    let right = weights.reduce((sum, curr) => sum + curr, 0);

    const canShip = (cap) => {
      let res = cap;
      let ship = 1;
      for (const weight of weights) {
        if (res - weight < 0) {
          res = cap;
          ship++;
        }
        res = res - weight;
      }
      return ship <= days;
    };
    let result = Infinity;
    while (left <= right) {
      let cap = parseInt((left + right) / 2);
      if (canShip(cap)) {
        result = Math.min(result, cap);
        right = cap - 1;
      } else {
        left = cap + 1;
      }
    }

    return result;
  }
}
