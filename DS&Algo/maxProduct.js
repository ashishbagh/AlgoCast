//Calculate max product of subarray
// arr = [1,2,-3,4]

const subarrayProduct = (arr) => {
  let res = Math.max(...arr);
  let currentMax = 1;
  let currentMin = 1;
  let temp = 1;
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      currentMax = 1;
      currentMin = 1;
      continue;
    }
    temp = currentMax * arr[i];
    currentMax = Math.max(temp, currentMin * arr[i], arr[i]);
    currentMin = Math.min(temp, currentMin * arr[i], arr[i]);
    res = Math.max(res, currentMax);
  }

  return res;
};

console.log(subarrayProduct([1, 2, -3, 4]));
console.log(subarrayProduct([6, -3, -10, 0, 2]));
