class PubSub {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = new Set();
    }
    this.events[event].add(callback);
    return function () {
      this.unsubscribe(event, callback);
    };
  }

  unsubscribe(event, callback) {
    if (!this.events[event]) return;
    this.events[event].delete(callback);
    if (this.events[event].size === 0) {
      delete this.events[event];
    }
  }

  publish(event, data) {
    if (!this.events[event]) return;
    for (const callback of this.events[event]) {
      callback(data);
    }
  }
}

const pubsub = new PubSub();

const unsubscribe = pubsub.subscribe("message", (data) => {
  console.log("Received:", data);
});

pubsub.publish("message", "Hello");
// Received: Hello

unsubscribe();

pubsub.publish("message", "World");
// nothing happens
