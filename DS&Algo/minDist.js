// You are given an array A, of N elements.
// Find minimum index based distance between two elements of the array, x and y.

// Example 1:
// Input:
// N = 7 A[] = {86,39,90,67,84,66,62}
// x = 42, y = 12
// Output: -1
// Explanation: x = 42 and y = 12. We return
// -1 as x and y don't exist in the array.
// N = 4 A[] = {1,2,3,2}
// x = 1, y = 2
// Output: 1
// Explanation: x = 1 and y = 2. There are
// two distances between x and y, which are
// 1 and 3 out of which the least is 1.

const minDist = (arr, n, x, y) => {
  // previous index and min distance
  let previous = -1,
    min_dist = Number.MAX_VALUE;

  for (let i = 0; i < n; i++) {
    if (arr[i] === x || arr[i] === y) {
      // we will check if p is not equal to -1 and
      // If the element at current index matches with
      // the element at index p , If yes then update
      // the minimum distance if needed
      if (previous !== -1 && arr[i] !== arr[previous]) {
        min_dist = Math.min(min_dist, i - previous);
      }

      // update the previous index
      previous = i;
    }
  }
  // If distance is equal to var max
  if (min_dist === Number.MAX_VALUE) return -1;
  console.log(min_dist);
};

// minDist(
//   [
//     13, 98, 5, 10, 23, 13, 4, 53, 60, 78, 66, 68, 44, 69, 79, 71, 90, 17, 91,
//     84, 34, 52, 12, 11, 57, 61, 2,
//   ],
//   27,
//   78,
//   68
// );

minDist(
  [
    52, 60, 40, 8, 14, 90, 63, 53, 48, 41, 7, 33, 80, 82, 82, 27, 82, 81, 48,
    91, 63, 37, 63, 32, 6, 44, 52, 80, 81, 60, 71, 84, 71, 62, 92, 84, 51, 6,
    88, 98, 46, 94, 83, 26, 27, 64, 4, 60, 96, 51, 2, 11, 87, 64, 94, 93, 60,
    45, 24, 92, 56, 46, 76, 78, 7, 19, 13, 10, 24, 100, 59, 21, 45, 93, 98, 23,
    9, 1, 34, 4, 51, 35, 14, 38, 51, 7, 82, 10, 4, 57, 1, 11,
  ],
  92,
  1,
  27
);
