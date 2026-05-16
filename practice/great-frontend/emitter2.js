export default class EventEmitter {
  constructor() {
    this.cache = new Map();
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  on(eventName, listener) {
    if (!this.cache.has(eventName)) {
      this.cache.set(eventName, new Set());
    }
    if (this.cache.get(eventName).has(listener)) return this;
    this.cache.get(eventName).add(listener);
    return this;
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  off(eventName, listener) {
    if (!this.cache.has(eventName)) return this;
    this.cache.get(eventName).delete(listener);
    if (this.cache.get(eventName).size == 0) this.cache.delete(eventName);
    return this;
  }

  /**
   * @param {string} eventName
   * @param  {...any} args
   * @returns {boolean}
   */
  emit(eventName, ...args) {
    if (!this.cache.has(eventName)) return false;
    const events = this.cache.get(eventName);
    for (const callbacks of events) {
      callbacks.apply(this, args);
    }
    return true;
  }
}
