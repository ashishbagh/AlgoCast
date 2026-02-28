// Given an array arr[] of positive integers. Reverse every sub-array group of size k.
// Note: If at any instance, k is greater or equal to the array size, then reverse the entire array.

// Examples:

// Input: arr[] = [1, 2, 3, 4, 5], k = 3
// Output: [3, 2, 1, 5, 4]
// Explanation: First group consists of elements 1, 2, 3. Second group consists of 4, 5.
// Input: arr[] = [5, 6, 8, 9], k = 5
// Output: [9, 8, 6, 5]
// Explnation: Since k is greater than array size, the entire array is reversed.

const reversspace = (arr, k) => {
  if (arr.length < k) {
    return arr.reverse();
  }
  let size = 0;
  let result = [];
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    if (size === k) {
      result = [...result, ...temp.reverse()];
      size = 0;
      temp = [];
    }
    temp.push(arr[i]);
    size++;
  }
  if (temp.length > 0) {
    result = [...result, ...temp.reverse()];
  }
  return result;
};

const recRev = (arr, k) => {
  for (let i = 0; i < arr.length; i += k) {
    let left = i;
    let right = Math.min(i + k - 1, arr.length - 1);

    while (left < right) {
      let swap = arr[left];
      arr[left] = arr[right];
      arr[right] = swap;
      left++;
      right--;
    }
  }
  
  return arr;
};

console.log(recRev([1, 2, 3, 4, 5], 3));
