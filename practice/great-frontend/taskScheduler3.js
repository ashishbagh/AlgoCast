// Implement an AsyncTaskScheduler class with a concurrency limit.
// The scheduler should:

// accept async tasks
// run at most N tasks at the same time
// start the next queued task as soon as one finishes
// return a promise for each scheduled task
// preserve task result/rejection for the caller

class AsyncTaskScheduler {
  constructor(concurrency, max, window) {
    this.concurrency = concurrency;
    this.queue = [];
    this.running = 0;
    this.startTimes = [];
    this.window = window;
    this.max = max;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.scheduler();
    });
  }

  getWaitTime() {
    const now = Date.now();
    this.startTimes = this.startTimes.filter(
      (time) => now - time < this.window,
    );
    if (this.startTimes.length < this.max) return 0;

    return this.window - (now - this.startTimes[0]);
  }

  scheduler() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const waitTime = this.getWaitTime();
      if (waitTime > 0) {
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.timer = null;
            this.scheduler();
          }, waitTime);
        }
        return;
      }

      this.taskProcessor();
    }
  }

  taskProcessor() {
    if (this.queue.length === 0) return;
    const { task, resolve, reject } = this.queue.shift();
    this.running++;
    this.startTimes.push(Date.now());
    task()
      .then((value) => {
        resolve(value);
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        this.running--;
        this.scheduler();
      });
  }
}

const start = Date.now();

const createTask = (name, delay, shouldReject = false) => {
  return () => {
    console.log(`${name} Start @ ${Date.now() - start}ms`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          console.log(`${name} Reject @ ${Date.now() - start}ms`);
          reject(`${name} failed`);
        } else {
          console.log(`${name} Resolve @ ${Date.now() - start}ms`);
          resolve(name);
        }
      }, delay);
    });
  };
};

// only concurrency test
// const scheduler = new AsyncTaskScheduler(2, 10, 1000);

// scheduler.add(createTask("A", 1000)).then(console.log);
// scheduler.add(createTask("B", 500)).then(console.log);
// scheduler.add(createTask("C", 300)).then(console.log);
// scheduler.add(createTask("D", 400)).then(console.log);

// concurrency test case
// const scheduler = new AsyncTaskScheduler(1, 10, 1000);

// scheduler.add(createTask("A", 300)).then(console.log);
// scheduler.add(createTask("B", 300)).then(console.log);
// scheduler.add(createTask("C", 300)).then(console.log);

// rate limiting test case
// const scheduler = new AsyncTaskScheduler(5, 2, 3000);

// scheduler.add(createTask("A", 500)).then(console.log);
// scheduler.add(createTask("B", 500)).then(console.log);
// scheduler.add(createTask("C", 500)).then(console.log);
// scheduler.add(createTask("D", 500)).then(console.log);

const scheduler = new AsyncTaskScheduler(2, 3, 5000);

scheduler.add(createTask("A", 7000)).then(console.log);
scheduler.add(createTask("B", 2000)).then(console.log);
scheduler.add(createTask("C", 4000)).then(console.log);
scheduler.add(createTask("D", 1000)).then(console.log);
scheduler.add(createTask("E", 1000)).then(console.log);
