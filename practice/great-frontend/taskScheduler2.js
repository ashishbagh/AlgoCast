// Problem: Parallel task limit
// Implement a function called parallelLimit that takes two parameters:

// tasks: An array of functions that return promises
// limit: Maximum number of tasks to run in parallel
// The parallelLimit function should execute the tasks in parallel, but limit the number of concurrent tasks to a given limit. The function should return a promise that resolves to an array of results, where each result is the resolved value of the task.

const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
  () => new Promise((resolve) => setTimeout(() => resolve(2), 500)),
  () => new Promise((resolve) => setTimeout(() => resolve(3), 100)),
  () => new Promise((resolve) => setTimeout(() => resolve(4), 800)),
];

// With limit of 2 concurrent tasks
// const results = await parallelLimit(tasks, 2);
// console.log(results); // [2, 3, 1, 4]

// //taskScheduler([1, 2, 8, 9, 10], [10, 1000, 2200, 80], 2);

const taskProcessor = async (task) => {
  console.log(`${task}- queued`);
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(task), task * 1000);
  });
};

const taskScheduler = (queue, timers, n) => {
  let running = 0;

  const scheduler = () => {
    while (running < n && queue.length > 0) {
      const task = queue.shift();
      running++;
      taskProcessor(task).then((data) => {
        console.log(`${data}- resolved`);
        running--;
        scheduler();
      });
    }
  };
  scheduler();
};

taskScheduler([1, 2, 8, 9, 10], [10, 1000, 2200, 80], 2);
//
