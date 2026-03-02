function customPromise(executor) {
  // pending
  // reject ---> catch
  // full fill --> then
  this.state = "pending";
  let onResolve, onReject;
  this.then = (callback) => {
    onResolve = callback;
    let value = this.value;
    if (this.state === "fullfilled") {
      callback(value);
    }
    return this;
  };

  this.catch = (callback) => {
    onReject = callback;
    let value = this.value;
    if (this.state === "rejected") {
      callback(value);
      console.log(this.state);
    }
    return this;
  };

  function resolve(val) {
    this.state = "fullfilled";
    this.value = val;
    if (typeof onResolve === "function") {
      onResolve(val);
      console.log(this.state);
    }
  }

  function reject(val) {
    this.state = "rejected";
    this.value = val;
  }

  executor(resolve, reject);
  console.log("pending");
}

// Usage
new customPromise((resolve, reject) => {
  setTimeout(() => resolve("Data loaded"), 1000);
}).then((data) => console.log(data));
