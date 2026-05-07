//To increase efficiency amazon shipping team will group packages being shipped according to weight
// They will merge a lighter package to heavy package, which eliminates to need for shipment
// consider n pacakges where arr[i] represent package at ith position
// you can combine(sum) ith and i+1 th package if  arr[i]<arr[i+1] and discard ith package
// Find the maximum possible weight of a package that can be acheived after merging operations
function maxPackageWeight(arr) {
  let ans = arr[arr.length - 1];
  let current = arr[arr.length - 1];

  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] < current) {
      current += arr[i];
    } else {
      current = arr[i];
    }

    ans = Math.max(ans, current);
  }

  return ans;
}

console.log(maxPackageWeight([2, 9, 10, 3, 7])); //[21,10]
maxPackageWeight([20, 13, 8, 9]); //[50]
