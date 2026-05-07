class Solution {
  /**
   * @param {number[]} stones
   * @return {number}
   */
  lastStoneWeight(stones) {
    while (stones.length > 1) {
      stones.sort((a, b) => a - b);
      let x = stones.pop();
      let y = stones.pop();
      if (x !== y) {
        stones.push(x - y);
      }
    }

    return stones.length > 0 ? stones[0] : 0;
  }
}
