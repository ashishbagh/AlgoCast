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
