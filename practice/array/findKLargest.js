class Solution {
  /**
   * @param {number[]} nums
   * @param {number} k
   * @return {number}
   */
  findKthLargest(nums, k) {
    return this.quickSort(nums, 0, nums.length - 1, nums.length - k);
  }

  quickSort(arr, from, to, k) {
    let pivotIndex = this.partition(arr, from, to);
    if (k < pivotIndex) {
      return this.quickSort(arr, from, pivotIndex - 1, k);
    } else if (k > pivotIndex) {
      return this.quickSort(arr, pivotIndex + 1, to, k);
    }
    return arr[pivotIndex];
  }

  partition(arr, from, to) {
    let left = from;
    let pivot = to;
    for (let i = from; i < to + 1; i++) {
      if (arr[i] < arr[pivot]) {
        [arr[left], arr[i]] = [arr[i], arr[left]];
        left++;
      }
    }
    // move pivot
    [arr[left], arr[pivot]] = [arr[pivot], arr[left]];
    return left;
  }
}
