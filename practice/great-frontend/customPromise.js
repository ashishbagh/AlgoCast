function customPromise(executor) {
  // pending
  // reject ---> catch
  this.state = "pending";
  let onResolve, onReject;
  this.value = "";
  this.error = "";

  this.then = function (callbackFn) {
    onResolve = callbackFn;
    if (this.state === "fullfilled") {
      callbackFn(this.value);
    }
  };

  this.catch = function (callbackFn) {
    onReject = callbackFn;
    if (this.state === "rejected") {
      callbackFn(this.error);
    }
  };

  function resolve(value) {
    this.value = value;
    this.state = "fullfilled";
    if (typeof onResolve === "function") {
      onResolve(value);
    }
  }

  function reject() {
    this.error = error;
    this.state = "rejected";
    if (typeof onReject === "function") {
      onReject(value);
    }
  }

  executor(resolve, reject);
}

// Usage
new customPromise((resolve, reject) => {
  setTimeout(() => resolve("Data loaded"), 1000);
}).then((data) => console.log(data));
