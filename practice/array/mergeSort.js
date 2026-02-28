function mergeSort(arr, from, to) {
  if (to - from < 1) {
    return;
  } else {
    var middle = parseInt((to + from) / 2);
    mergeSort(arr, from, middle);
    mergeSort(arr, middle + 1, to);
    mergeArray(arr, from, middle, to);
  }
}

function mergeArray(output, from, middle, to) {
  let sorted1 = output.slice(from, middle + 1);
  let sorted2 = output.slice(middle + 1, to + 1);
  let leftPointer = 0;
  let rightPointer = 0;

  for (var i = from; i <= to; i++) {
    if (leftPointer === sorted1.length) {
      while (rightPointer < sorted2.length) {
        output[i] = sorted2[rightPointer];
        rightPointer++;
        i++;
      }
      return;
    }
    if (rightPointer === sorted2.length) {
      while (leftPointer < sorted1.length) {
        output[i] = sorted1[leftPointer];
        leftPointer++;
        i++;
      }
      return;
    }

    if (sorted1[leftPointer] < sorted2[rightPointer]) {
      output[i] = sorted1[leftPointer];
      leftPointer++;
    } else {
      output[i] = sorted2[rightPointer];
      rightPointer++;
    }
  }
}

var result = [100, 10, 15, 23, 2, 9, 28, 1, 36, 1];
mergeSort(result, 0, result.length - 1);
console.log(result);
