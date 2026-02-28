const bubbleSort = (arr) => {
  for (let j = 0; j < arr.length; j++) {
    for (let i = 0; i < arr.length - j - 1; i++) {
      console.log(arr[i]);
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
      }
    }
  }
  return arr;
};

console.log(bubbleSort([100, 10, 15, 23, 2, 9, 28, 1, 36, 1]));
