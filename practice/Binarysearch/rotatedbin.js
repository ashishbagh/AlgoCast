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

const minInArr = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = parseInt((left + right) / 2);
    if (arr[mid] > target) {
      right = mid - 1;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      return mid;
    }
  }

  return -1;
};

//console.log(rotatedArr([7, 8, 9, 4, 5, 6], 0, 6));

console.log(minInArr([1, 2, 3, 4, 5, 6], 4));
