// There are n gas stations along a circular route. You are given two integer arrays gas and cost where:

// gas[i] is the amount of gas at the ith station.
// cost[i] is the amount of gas needed to travel from the ith station to the (i + 1)th station. (The last station is connected to the first station)
// You have a car that can store an unlimited amount of gas, but you begin the journey with an empty tank at one of the gas stations.

// Return the starting gas station's index such that you can travel around the circuit once in the clockwise direction. If it's impossible, then return -1.

// It's guaranteed that at most one solution exists.

// Example 1:

// Input: gas = [1,2,3,4], cost = [2,2,4,1]

// Output: 3
// Explanation: Start at station 3 and fill up with gas[3] = 4, so tank = 4.
// Travel from station 3 to station 0, spending cost[3] = 1, then fill gas[0] = 1, so tank = 4 - 1 + 1 = 4.
// Travel from station 0 to station 1, spending cost[0] = 2, then fill gas[1] = 2, so tank = 4 - 2 + 2 = 4.
// Travel from station 1 to station 2, spending cost[1] = 2, then fill gas[2] = 3, so tank = 4 - 2 + 3 = 5.
// Travel from station 2 back to station 3, spending cost[2] = 4, so tank = 5 - 4 = 1.
// The circuit is complete, so return 3.

// Example 2:

// Input: gas = [1,2,3], cost = [2,3,2]

// Output: -1
// Explanation:
// You cannot start at station 0 or 1 because neither has enough gas to travel to the next station.
// If you start at station 2, fill gas[2] = 3, so tank = 3.
// Travel from station 2 to station 0, spending cost[2] = 2, then fill gas[0] = 1, so tank = 3 - 2 + 1 = 2.
// Travel from station 0 to station 1, spending cost[0] = 2, then fill gas[1] = 2, so tank = 2 - 2 + 2 = 2.
// To travel from station 1 to station 2, you need cost[1] = 3 gas, but the tank only has 2.
// So no starting station can complete the circuit, and the answer is -1.

class Solution {
  /**
   * @param {number[]} gas
   * @param {number[]} cost
   * @return {number}
   */
  canCompleteCircuit(gas, cost) {
    let sumGas = gas.reduce((a, b) => a + b, 0);
    let sumCost = cost.reduce((a, b) => a + b, 0);
    if (sumGas < sumCost) return -1;

    let i = 0;
    let total = 0;
    let res = 0;
    while (i < gas.length) {
      total += gas[i] - cost[i];
      if (total < 0) {
        total = 0;
        res = i + 1;
      }
      i++;
    }
    return res;
  }
}
