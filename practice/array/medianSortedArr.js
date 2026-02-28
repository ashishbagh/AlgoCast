class Solution {
  /**
   * @param {number[]} nums1
   * @param {number[]} nums2
   * @return {number}
   */
  findMedianSortedArrays(nums1, nums2) {
    let res = [];
    let left = 0,
      right = 0;

    while (left < nums1.length && right < nums2.length) {
      if (nums1[left] < nums2[right]) {
        res.push(nums1[left]);
        left++;
      } else {
        res.push(nums2[right]);
        right++;
      }
    }

    while (right < nums2.length) {
      res.push(nums2[right]);
      right++;
    }
    while (left < nums1.length) {
      res.push(nums1[left]);
      left++;
    }

    let n = res.length;
    let mid = Math.floor(n / 2);
    if (n % 2 === 0) {
      let median = (res[mid] + res[mid - 1]) / 2;
      return median;
    } else {
      return res[mid];
    }
  }

  // Optimised in O(1)
  findMedianSortedArrays2(nums1, nums2) {
    let total = nums1.length + nums2.length;
    let mid = Math.floor(total / 2);
    let left = 0,
      right = 0;
    let prev = 0,
      curr = 0;

    for (let i = 0; i <= mid; i++) {
      prev = curr;
      if (left >= nums1.length) {
        curr = nums2[right++];
      } else if (right >= nums2.length) {
        curr = nums1[left++];
      } else if (nums1[left] < nums2[right]) {
        curr = nums1[left++];
      } else {
        curr = nums2[right++];
      }
    }

    return total % 2 === 0 ? (prev + curr) / 2 : curr;
  }
}
