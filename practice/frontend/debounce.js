/**
 * @param {Function} func
 * @param {number} wait
 * @return {Function}
 */
export default function debounce(func, wait) {
    const cache = { timeoutId: '' };
    return function (...args) {
        let timeoutId = cache.timeoutId;
        const fn = function () { func.call(this, ...args); clearTimeout(cache.timeoutId); return this; }
        if (!timeoutId) {
            let id = setTimeout(fn.bind(this), wait);
            cache.timeoutId = id;
        } else {
            clearTimeout(timeoutId);
            let id = setTimeout(fn.bind(this), wait);
            cache.timeoutId = id;
        }
        return this;
    };
}