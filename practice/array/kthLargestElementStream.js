class KthLargest {
  /**
   * @param {number} k
   * @param {number[]} nums
   */
  constructor(k, nums) {
    this.k = k;
    this.arr = nums.sort((a, b) => a - b);
    // console.log(this.arr);
  }

  /**
   * @param {number} val
   * @return {number}
   */
  add(val) {
    let arr = this.arr || [];
    if (arr.length > 0) arr.unshift(val);
    else arr.push(val);

    // bubble sort
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
    // remove last element if arr size greater than k
    if (arr.length > this.k) arr = arr.slice(1, arr.length);
    return arr[arr.length - this.k];
  }
}
