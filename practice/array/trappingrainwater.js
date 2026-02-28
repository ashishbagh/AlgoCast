const trap = (arr) => {
  let left = 0;
  let right = arr.length - 1;
  let rightMax = 0;
  let leftMax = 0;
  let res = 0;

  while (left < right) {
    if (leftMax <= rightMax) {
      leftMax = Math.max(leftMax, arr[left]);
      res += leftMax - arr[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, arr[right]);
      res += rightMax - arr[right];
      right--;
    }
  }

  return res;
};
