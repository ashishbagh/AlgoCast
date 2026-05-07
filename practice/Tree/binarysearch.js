// Consider the sorted array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] and a target of 23.

const binarySearch = (arr, number, start, end) => {
  if (start > end) {
    return -1; // Element not found
  }

  let mid = parseInt((start + end) / 2);

  if (arr[mid] === number) {
    return mid; // Found it!
  } else if (arr[mid] > number) {
    return binarySearch(arr, number, start, mid - 1); // Search left
  } else {
    return binarySearch(arr, number, mid + 1, end); // Search right
  }
};

//console.log(binarySearch([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 8, 0, 10));
console.log(binarySearch([-1, 0, 2, 4, 6, 8], 4, 0, 5));  // 3 (index of 4)
console.log(binarySearch([-1, 0, 2, 4, 6, 8], 99, 0, 5)); // -1 (not found)
