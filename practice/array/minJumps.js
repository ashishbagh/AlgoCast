const minJumps = (arr) => {
  let farthest = 0;
  let jumps = 0;
  let right = 0;
  if (arr[0] === 0) {
    return -1;
  }

  for (let i = 0; i < arr.length; i++) {
    farthest = Math.max(farthest, arr[i] + i);
    if (i === right) {
      right = farthest;
      jumps++;
      // Can't progress further
      if (right >= arr.length - 1) break;
      if (right === i) return -1;
    }
  }

  return jumps;
};

console.log(minJumps([1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9]));

console.log(minJumps([1, 4, 3, 6, 0, 7]));
