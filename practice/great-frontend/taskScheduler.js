const taskProcessor = (task) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`${task}- executed successfully`), 1000 * task);
  });
};

const taskScheduler = (queue, delays, n) => {
  let running = 0; // scoped inside — no global state

  const scheduler = () => {
    while (running < n && queue.length > 0) {
      const task = queue.shift();
      console.log(`${task}- queued`);
      running++;

      taskProcessor(task).then((data) => {
        console.log(data);
        running--;
        scheduler(); // slot opened → immediately try to pick next
      });
    }
  };

  const scheduleNext = () => {
    if (delays.length === 0 || queue.length === 0) return;
    const nextDelay = delays.shift();
    setTimeout(() => {
      scheduler(); // try to fill slots at this trigger point
      scheduleNext(); // chain to next delay
    }, nextDelay);
  };

  scheduler(); // initial fill
  scheduleNext(); // start delay-based triggers
};

taskScheduler([1, 2, 8, 9, 10], [10, 1000, 2200, 80], 2);

// 1- queued
// 10
// 2- queued
// 1- executed successfully
// 1000
// 8- queued
// 2- executed successfully
// 2200
// 9- queued
// 80
// 10- queued
// 8- executed successfully
// 9- executed successfully
// 10- executed successfully
