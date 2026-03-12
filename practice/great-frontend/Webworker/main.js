
require

function main() {
  const Webworker = new Worker("/worker.js");

  Webworker.onmessage = (event) => {
    console.log("Message from worker", event.data);
  };

  Webworker.postMessage("Hello Worker");
}

export default main;
