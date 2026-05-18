const trap = (arr) => {
  let left = 0;
  let right = arr.length - 1;
  let rightMax = arr[right];
  let leftMax = arr[left];
  let res = 0;

  while (left < right) {
    if (leftMax <= rightMax) {
      left++;
      leftMax = Math.max(leftMax, arr[left]);
      res += leftMax - arr[left];
    } else {
      right--;
      rightMax = Math.max(rightMax, arr[right]);
      res += rightMax - arr[right];
    }
  }

  return res;
};
