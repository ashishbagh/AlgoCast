//taskScheduler([1, 2, 8, 9, 10], [10, 1000, 2200, 80], 2);

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
