class Solution {
  /**
   * @param {number[]} nums
   * @return {number[][]}
   */
  threeSum(nums) {

    let arr = nums.sort((a, b) => a - b);
    let map = new Set();
    let results = [];
    const targetSum = (target, left, right, res) => {
      while (left < right) {
        if (arr[left] + arr[right] < target) {
          left++
        } else if (arr[left] + arr[right] > target) {
          right--
        } else {
          let temp = [...res, ...[arr[left], arr[right]]];
          if (!map.has(temp.join(''))) {
            map.add(temp.join(''));
            results.push(temp);
          }
          left++;
          right--;
        }
      }
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      //map.add(arr[i]);
      targetSum(arr[i] * -1, i + 1, arr.length - 1, [arr[i]]);
    }
    return results;

  }
}
