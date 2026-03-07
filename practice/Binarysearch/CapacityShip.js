// A conveyor belt has packages that must be shipped from one port to another within days days.

// The ith package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages on the conveyor belt (in the order given by weights). It is not allowed to load weight more than the maximum weight capacity of the ship.

// Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days.

// Example 1:

// Input: weights = [2,4,6,1,3,10], days = 4

// Output: 10

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
