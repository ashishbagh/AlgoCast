// [4, 5, 6, 1, 2, 3];
// find the min in the rotated sorted array

const rotatedArr = (arr, start, end) => {
  if (start >= end) {
    console.log(arr[end]);
    return;
  }

  const mid = parseInt((start + end) / 2);
  if (arr[mid] > arr[end]) {
    rotatedArr(arr, mid + 1, end);
  } else {
    rotatedArr(arr, start, mid);
  }
};

console.log(rotatedArr([7, 8, 9, 4, 5, 6], 0, 6));
