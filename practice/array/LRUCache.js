class LRUCache {
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        this.cache = {};
        this.capacity = capacity;
        this.recentKey = "";
    }

    /**
     * @param {number} key
     * @return {number}
     */
    get(key) {
        if (!this.cache[key]) {
            return -1
        }
        this.recentKey = key;
        return this.cache[key];
    }

    /**
     * @param {number} key
     * @param {number} value
     * @return {void}
     */
    put(key, value) {
        let keys = Object.keys(this.cache);
        if (keys.length === this.capacity) {
            delete this.cache[this.recentKey];
            this.cache[key] = value;
        } else {
            if (!this.cache[key]) {
                this.cache[key] = value;
            } else {
                this.recentKey = key;
                this.cache[key] = value;
            }
        }

    }
}
