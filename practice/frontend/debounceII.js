/**
 * @param {Function} func
 * @param {number} wait
 * @return {Function}
 */
export default function debounce(func, wait) {
    const cache = { timeoutId: undefined, data: "" };

    const debounce = function (...args) {
        let timeoutId = cache.timeoutId;
        const fn = function () { func.call(this, ...args); clearTimeout(cache.timeoutId); cache.timeoutId = undefined return this; }
        cache.data = args;
        if (!timeoutId) {
            let id = setTimeout(fn.bind(this), wait);
            cache.timeoutId = id;
        } else {
            clearTimeout(timeoutId);
            let id = setTimeout(fn.bind(this), wait);
            cache.timeoutId = id;
        }
        return this;
    }.bind(this);

    debounce.cancel = function () {
        let timeoutId = cache.timeoutId;
        if (timeoutId) {
            clearTimeout(timeoutId);
            cache.timeoutId = undefined
        }
    }.bind(this)

    debounce.flush = function () {
        let timeoutId = cache.timeoutId;
        if (timeoutId) {
            func.call(this, ...cache.data);
            clearTimeout(timeoutId);
        }
    }.bind(this)

    return debounce;
}