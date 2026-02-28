const generateBinary = (n) => {
  const bits = Math.ceil(Math.log2(n + 1)) || 1;

  for (let i = 0; i <= n; i++) {
    let binary = "";
    for (let j = bits - 1; j >= 0; j--) {
      binary += (i >> j) & 1;
    }
    console.log(`${i} → ${binary}`);
  }
};

generateBinary(7);
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
