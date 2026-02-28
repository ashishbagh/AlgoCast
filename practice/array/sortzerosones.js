// Given an array arr[] containing only 0s, 1s, and 2s. Sort the array in ascending order.
// Note: You need to solve this problem without utilizing the built-in sort function.

// Examples:

// Input: arr[] = [0, 1, 2, 0, 1, 2]
// Output: [0, 0, 1, 1, 2, 2]
// Explanation: 0s, 1s and 2s are segregated into ascending order.
// Input: arr[] = [0, 1, 1, 0, 1, 2, 1, 2, 0, 0, 0, 1]
// Output: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2]
// Explanation: 0s, 1s and 2s are segregated into ascending order.


const sortZeroes = (arr) => {
    const map = {};
    arr.forEach((element) => {
        if (!map[element]) {
            map[element] = [element];
        } else {
            map[element].push(element);
        }
    })

    return [...map[0], ...map[1], ...map[2]];
}


console.log(sortZeroes([0, 1, 2, 0, 1, 2]));

// Dutch National Flag Algorithm - O(n) time, O(1) space, in-place
const dutchFlagSort = (arr) => {
    let low = 0;          // boundary for 0s (everything before low is 0)
    let mid = 0;          // current element being examined
    let high = arr.length - 1;  // boundary for 2s (everything after high is 2)

    while (mid <= high) {
        if (arr[mid] === 0) {
            // Swap with low, move both pointers forward
            [arr[low], arr[mid]] = [arr[mid], arr[low]];
            low++;
            mid++;
        } else if (arr[mid] === 1) {
            // 1 is in correct position, just move mid forward
            mid++;
        } else {
            // arr[mid] === 2, swap with high, only move high back
            [arr[mid], arr[high]] = [arr[high], arr[mid]];
            high--;
            // Don't increment mid - need to check swapped element
        }
    }
    return arr;
};

console.log(dutchFlagSort([0, 1, 2, 0, 1, 2]));
console.log(dutchFlagSort([0, 1, 1, 0, 1, 2, 1, 2, 0, 0, 0, 1]));