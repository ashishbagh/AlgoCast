/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
const leastInterval = (tasks, n) => {
  let stack = [];
  let map = new Map();
  let count = 0;

  for (let i = 0; i < tasks.length; i++) {
    let val = map.get(tasks[i]);
    if (!val) {
      map.set(tasks[i], 1);
    } else {
      map.set(tasks[i], 1 + val);
    }
  }

  while (true) {
    let size = map.size;
    if (size === 0) {
      break;
    }

    if (stack.length >= n + 1 || stack.length === 0) {
      stack = [];
      for (const key of map.keys()) {
        count++;
        stack.push(key);
        let val = map.get(key);
        if (val - 1 === 0) {
          map.delete(key);
          continue;
        }
        map.set(key, val - 1);
      }
    } else {
      stack.push("idle");
      count++;
    }
  }

  return count;
};

console.log(leastInterval(["A", "C", "A", "B", "D", "B"], 1));
