const missingNum = (nums) => {
  let map = new Map();
  for (let i = 0; i <= nums.length; i++) {
    map.set(nums[i], nums[i]);
  }

  for (let i = 0; i <= nums.length; i++) {
    if (map.get(i) === undefined) {
      return i;
    }
  }
};

console.log(missingNum([13, 5, 4, 10, 7, 11, 1, 9, 12, 8, 2, 6]));
