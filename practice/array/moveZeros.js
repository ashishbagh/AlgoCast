//[2,0,4,1,0,8];

const move = (arr) => {
  let l = 0;

  for (let i in arr) {
    if (arr[i] !== 0) {
      [arr[l], arr[i]] = [arr[i], arr[l]];
      l++;
    }
  }

  return arr;
};

console.log(move([2, 0, 4, 1, 0, 8]));
