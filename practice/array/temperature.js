// You are given an array of integers temperatures where temperatures[i] represents the daily temperatures on the ith day.

// Return an array result where result[i] is the number of days after the ith day before a warmer temperature appears on a future day. If there is no day in the future where a warmer temperature will appear for the ith day, set result[i] to 0 instead.

// Example 1:

// Input: temperatures = [30,38,30,36,35,40,28]

// Output: [1,4,1,2,1,0,0]

class Solution {
  /**
   * @param {number[]} temperatures
   * @return {number[]}
   */
  dailyTemperatures(temperatures) {
    let result = new Array(temperatures.length).fill(0);
    let stack = [0];

    for (let i = 1; i < temperatures.length; i++) {
      while (
        stack.length > 0 &&
        temperatures[i] > temperatures[stack[stack.length - 1]]
      ) {
        let n = stack[stack.length - 1];
        result[n] = i - n;
        stack.pop();
      }
      stack.push(i);
    }

    return result;
  }
}
