// You are given an integer array arr[]. You need to find the maximum sum of a subarray (containing at least one element) in the array arr[].

// Note : A subarray is a continuous part of an array.

// Examples:

// Input: arr[] = [2, 3, -8, 7, -1, 2, 3]
// Output: 11
// Explanation: The subarray [7, -1, 2, 3] has the largest sum 11.
// Input: arr[] = [-2, -4]
// Output: -2
// Explanation: The subarray [-2] has the largest sum -2.
// Input: arr[] = [5, 4, 1, 7, 8]
// Output: 25
// Explanation: The subarray [5, 4, 1, 7, 8] has the largest sum 25.

const maxSum = (arr) => {
  let pointer = 0;
  let newSum = 0;
  let highestSum = arr[0];
  let map = {};
  for (let i = 0; i < arr.length; i++) {
    pointer = i + 1;
    newSum = arr[i];
    let tempArray = [arr[i]];
    map[i] = [];
    while (pointer < arr.length) {
      newSum = arr[pointer] + newSum;
      tempArray.push(arr[pointer]);
      if (newSum > highestSum) {
        map[newSum] = tempArray;
        highestSum = newSum;
      }
      pointer++;
    }
  }
  const indexHighest = Object.keys(map).sort((a, b) => b - a);
  return map;
};

//console.log(maxSum([5, 4, 1, 7, 8]));

//above solution fails when all the values are negative

// below solution works well in this case.
const maxSumN = (arr) => {
  let pointer = 0;
  let newSum = 0;
  let highestSum = arr[0];
  let map = {};
  map[highestSum] = [highestSum];
  for (let i = 0; i < arr.length; i++) {
    pointer = i + 1;
    newSum = arr[i];
    let tempArray = [arr[i]];
    while (pointer < arr.length) {
      newSum = arr[pointer] + newSum;
      //   console.log(newSum, highestSum);
      tempArray.push(arr[pointer]);
      if (newSum > highestSum) {
        map[newSum] = tempArray;
        highestSum = newSum;
      }
      pointer++;
    }
  }
  const indexHighest = Object.keys(map).sort((a, b) => b - a);
  return map;
};

//console.log(maxSumN([5, 4, 1, 7, 8]));

// kadane algo

const kad = (arr) => {
  let left = 0;
  let sum = 0;
  let highestSum = arr[0];
  while (left < arr.length) {
    if (sum < 0) {
      sum = 0;
    }
    sum = sum + arr[left];
    highestSum = Math.max(highestSum, sum);
    left++;
  }
  console.log(highestSum);
};

kad([1, 2, 3, -2, 5]);
