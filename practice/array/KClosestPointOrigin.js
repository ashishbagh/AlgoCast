class Solution {
  /**
   * @param {number[][]} points
   * @param {number} k
   * @return {number[][]}
   */
  kClosest(points, k) {
    const dist = (point) => point[0] * point[0] + point[1] * point[1];

    const partition = (left, right) => {
      let pivot = dist(points[right]);
      let p = left;
      for (let i = left; i < right; i++) {
        if (dist(points[i]) <= pivot) {
          [points[i], points[p]] = [points[p], points[i]];
          p++;
        }
      }
      [points[p], points[right]] = [points[right], points[p]];
      return p;
    };

    const quickSelect = (left, right) => {
      if (left >= right) return;
      let pivot = partition(left, right);
      if (pivot === k) return;
      if (k < pivot) {
        quickSelect(left, pivot - 1);
      } else {
        quickSelect(pivot + 1, right);
      }
    };

    quickSelect(0, points.length - 1);
    return points.slice(0, k);
  }
}
