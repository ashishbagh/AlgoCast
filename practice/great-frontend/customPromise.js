class CustomPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.handler = [];

    const resolve = (value) => {
      if (this.state !== "pending") return;
      this.value = value;
      this.state = "fulfilled";
      this.runHandlers();
    };

    const reject = (error) => {
      if (this.state !== "pending") return;
      this.value = error;
      this.state = "rejected";
      this.runHandlers();
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  runHandlers() {
    queueMicrotask(() => {
      while (this.handler.length) {
        const { callback, onRejected, resolve, reject } = this.handler.shift();
        try {
          if (this.state === "fulfilled") {
            if (typeof callback === "function") {
              resolve(callback(this.value));
            } else {
              resolve(this.value);
            }
          } else {
            if (typeof onRejected === "function") {
              reject(onRejected(this.value));
            } else {
              reject(this.value);
            }
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  then(callback, onRejected) {
    return new CustomPromise((resolve, reject) => {
      this.handler.push({ callback, onRejected, resolve, reject });
      if (this.state !== "pending") {
        this.runHandlers();
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

const t = new CustomPromise((resolve, reject) => {
  resolve("sync success");
});

t.then((value) => {
  console.log("Test 1:", value);
});

const p = new CustomPromise((resolve) => {
  resolve(10);
});

p.then((x) => console.log("Test 6A:", x));
p.then((x) => console.log("Test 6B:", x));
