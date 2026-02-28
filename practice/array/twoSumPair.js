// Given an integer array arr, return all the unique pairs [arr[i], arr[j]] such that i != j and arr[i] + arr[j] == 0.

// Note: The pairs must be returned in sorted order, the solution array should also be sorted, and the answer must not contain any duplicate pairs.

// Examples:

// Input: arr = [-1, 0, 1, 2, -1, -4]
// Output: [[-1, 1]]
// Explanation: arr[0] + arr[2] = (-1)+ 1 = 0.
// arr[2] + arr[4] = 1 + (-1) = 0.
// The distinct pair are [-1,1].
// Input: arr = [6, 1, 8, 0, 4, -9, -1, -10, -6, -5]
// Output: [[-6, 6],[-1, 1]]
// Explanation: The distinct pairs are [-1, 1] and [-6, 6].

const twoSumOp = (arr) => {
  let map = {};
  let result = {};
  for (let i = 0; i < arr.length; i++) {
    let element = arr[i];
    if (element === 0) {
      if (map[element] !== undefined) {
        map[element] = map[element] + 1;
        continue;
      }
    }
    if (!map[element]) {
      map[element] = element;
    }
  }
  for (let i = 0; i < arr.length; i++) {
    let value = 0 - arr[i];
    if (value === 0 && map[value] === 0) {
      continue;
    }
    if (map[value]) {
      let key = [];
      if (arr[i] === 0) {
        key = [0, 0];
      } else {
        if (arr[i] > map[value]) {
          key = [map[value], arr[i]];
        } else if (arr[i] < map[value]) {
          key = [arr[i], map[value]];
        }
      }
      if (!result[key[0]]) {
        result[key[0]] = key;
      }
    }
  }

  return Object.values(result);
};

const twoSum = (arr) => {
  const map = {};
  arr.forEach((element, index) => {
    for (let i = index + 1; i < arr.length; i++) {
      if (element + arr[i] === 0) {
        const tempIndex = element > 0 ? element : arr[i];
        if (!map[tempIndex]) {
          map[tempIndex] = [
            element < 0 ? element : arr[i],
            element > 0 ? element : arr[i],
          ];
        }
      }
    }
  });
  return Object.values(map).reverse();
};

const aTwoSum = (arr) => {
  const map = {};
  let pointer = 0;
  const sorted = [...arr].sort((a, b) => a - b);
  result = [];
  for (let i = pointer + 1; i < arr.length; i++) {
    if (arr[pointer] + arr[i] === 0) {
      const tempIndex = arr[pointer] > 0 ? arr[pointer] : arr[i];
      if (!map[tempIndex]) {
        map[tempIndex] = [
          arr[pointer] > 0 ? arr[i] : arr[pointer],
          arr[pointer] > 0 ? arr[pointer] : arr[i],
        ];
        result.push([
          arr[pointer] > 0 ? arr[i] : arr[pointer],
          arr[pointer] > 0 ? arr[pointer] : arr[i],
        ]);
      }
      pointer = pointer + 1;
      i = pointer;
    }
    if (i === arr.length - 1) {
      pointer = pointer + 1;
      i = pointer;
    }
  }
  return result;
};

//console.log(aTwoSum([6, 1, 8, 0, 4, -9, -1, -10, -6, -5]));

// Optimized: Two-pointer approach - O(n log n) time, O(1) extra space (excluding result)
// No reverse needed - pairs are found in sorted order naturally
const optimizedTwoSum = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  console.log(sorted);
  const result = [];
  let left = 0;
  let right = sorted.length - 1;

  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === 0) {
      result.push([sorted[left], sorted[right]]);
      const leftVal = sorted[left];
      const rightVal = sorted[right];
      // Skip duplicates
      while (left < right && sorted[left] === leftVal) left++;
      while (left < right && sorted[right] === rightVal) right--;
    } else if (sum < 0) {
      left++;
    } else {
      right--;
    }
  }

  return result;
};

console.log("er");
console.log(twoSumOp([0, 0, 0]));
