// 0 → 000
// 1 → 001
// 2 → 010
// 3 → 011
// 4 → 100
// 5 → 101
// 6 → 110
// 7 → 111

// countbits

const countBits = (n) => {
  let dp = Array(n + 1).fill(0);
  let offset = 1; // offset is [1,2,4,8,16].. mult by 2
  for (let i = 1; i <= n; i++) {
    if (offset * 2 === i) {
      offset = i;
    }
    dp[i] = 1 + dp[i - offset];
  }
  return dp;
};
