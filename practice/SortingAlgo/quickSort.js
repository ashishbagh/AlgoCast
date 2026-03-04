const quickSort = (arr, from, to) => {
  if (from < to) {
    let pivotIndex = partition(arr, from, to);
    quickSort(arr, from, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, to);
  }
  return arr;
};

const partition = (arr, from, to) => {
  let left = from;
  let pivot = to;
  for (let i = from; i < to + 1; i++) {
    if (arr[i] < arr[pivot]) {
      [arr[left], arr[i]] = [arr[i], arr[left]];
      left++;
    }
  }
  // move pivot
  [arr[left], arr[pivot]] = [arr[pivot], arr[left]];
  return left;
};

let input1 = [2, 5, 20, 15, 1, 11, 8];

let input = [100, 10, 15, 23, 2, 9, 28, 1, 36, 1];

let input2 = [1, 2, 3, 4, 5];

console.log(quickSort(input, 0, input.length - 1));
