// Given an array of integers numbers that is sorted in non-decreasing order.
// Return the indices (1-indexed) of two numbers, [index1, index2], such that they add up to a given target number target and index1 < index2. Note that index1 and index2 cannot be equal, therefore you may not use the same element twice.
// There will always be exactly one valid solution.
// Your solution must use
// O(1)O(1) additional space.
// Example 1:
// Input: numbers = [1,2,3,4], target = 3
// Output: [1,2]
//numbers=[2,3,4]
//target=6

const twoSum = (numbers, target) => {
  let map = {};
  for (let i = 0; i < numbers.length; i++) {
    if (!map[numbers[i]]) {
      map[numbers[i]] = i;
    } else {
      map[numbers[i] + "#"] = i;
    }
  }
  for (let i = 0; i < numbers.length; i++) {
    let value = target - numbers[i];
    if (
      (map[value] !== undefined && map[value] !== i) ||
      (map[value + "#"] !== undefined && map[value + "#"] !== i)
    ) {
      let index = map[value + "#"] ? map[value + "#"] : map[value];
      return [i, index];
    }
  }
};

let numbers = [2, 5, 5, 11],
  target = 10;
console.log(twoSum(numbers, target));
