// You are free to use alternative approaches of
// instantiating the EventEmitter as long as the
// default export has the same interface.

export default class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  on(eventName, listener) {
    let map = this.events;
    let events = map.get(eventName);
    if (!events) {
      map.set(eventName, [listener]);
    } else {
      // if(events.indexOf(listener) === -1){
      map.set(eventName, [...events, ...[listener]]);
      // }
    }
    return this;
    throw "Not implemented!";
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  off(eventName, listener) {
    const arr = this.events.get(eventName);

    // Return this for chaining even if nothing to remove
    if (!arr) {
      return this;
    }
    const index = arr.indexOf(listener);
    // Only splice if listener was actually found
    if (index !== -1) {
      arr.splice(index, 1);
    }
    return this;
  }

  /**
   * @param {string} eventName
   * @param  {...any} args
   * @returns {boolean}
   */
  emit(eventName, ...args) {
    let map = this.events;
    let arr = map.get(eventName);
    if (!arr) {
      return false;
    }
    arr = map.get(eventName);
    if (arr.length === 0) return false;
    arr.forEach((fn) => fn(...args));
    return true;
    throw "Not implemented!";
  }
}
