// Given an array of integers arr[]. You have to find the Inversion Count of the array.
// Note : Inversion count is the number of pairs of elements (i, j) such that i < j and arr[i] > arr[j].

// Examples:

// Input: arr[] = [2, 4, 1, 3, 5]
// Output: 3
// Explanation: The sequence 2, 4, 1, 3, 5 has three inversions (2, 1), (4, 1), (4, 3).
// Input: arr[] = [2, 3, 4, 5, 6]
// Output: 0
// Explanation: As the sequence is already sorted so there is no inversion count.
// Input: arr[] = [10, 10, 10]
// Output: 0
// Explanation: As all the elements of array are same, so there is no inversion count.

const inversionCount = (arr) => {
  let sum = 0;

  for (let i = 1; i < arr.length; i++) {
    let pointer = 0;
    while (pointer < i) {
      if (arr[i] < arr[pointer]) {
        sum += 1;
      }
      pointer++;
    }
  }
  return sum;
};

const split = (arr, start, end) => {
  if (end - start < 1) {
    return 0; // Base case: single element has no inversions
  }

  let mid = parseInt((start + end) / 2);
  let leftInv = split(arr, start, mid);
  let rightInv = split(arr, mid + 1, end);
  let mergeInv = mergeAndCount(arr, mid, start, end);

  return leftInv + rightInv + mergeInv;
};

const mergeAndCount = (arr, mid, start, end) => {
  let invCount = 0; // Start fresh for THIS merge
  let leftPointer = 0;
  let rightPointer = 0;
  let left = arr.slice(start, mid + 1);
  let right = arr.slice(mid + 1, end + 1);
  for (let i = start; i <= end; i++) {
    if (leftPointer === left.length) {
      while (rightPointer < right.length) {
        arr[i] = right[rightPointer];
        rightPointer++;
        i++;
      }
      return invCount;
    }

    if (rightPointer === right.length) {
      while (leftPointer < left.length) {
        arr[i] = left[leftPointer];
        leftPointer++;
        i++;
      }
      return invCount;
    }

    if (left[leftPointer] <= right[rightPointer]) {
      arr[i] = left[leftPointer];
      leftPointer++;
    } else {
      invCount = invCount + (left.length - leftPointer);
      arr[i] = right[rightPointer];
      rightPointer++;
    }
  }

  return invCount;
};

// Test your split function
const testArr = [2, 4, 1, 3, 5];
console.log(split(testArr, 0, testArr.length - 1)); // 3 (your implementation)
