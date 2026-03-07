class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  /**
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    let value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return this.cache.get(key);
  }

  /**
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      let leastReacentUsed = this.cache.keys().next().value;
      this.cache.delete(leastReacentUsed);
    }
  }
}
