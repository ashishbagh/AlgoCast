// Given an integer array nums, return an array output where output[i] is the product of all the elements of nums except nums[i].
// Each product is guaranteed to fit in a 32-bit integer.
// Follow-up: Could you solve it in
// O
// (n)
// O(n) time without using the division operation?

const productExceptSelf = (nums) => {
  let result = Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = prefix;
    prefix = prefix * nums[i];
  }
  let post = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] = post * result[i];
    post = post * nums[i];
  }

  return result;
};

console.log(productExceptSelf([1, 2, 3, 4]));
//console.log(productExceptSelf([[-1, 0, 1, 2, 3]]));
