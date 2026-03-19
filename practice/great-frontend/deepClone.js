// Implement a function deepEqual that performs a deep comparison between two values. It returns true if two input values are deemed equal, and returns false if not.

// You can assume there are only JSON-serializable values (numbers, strings, boolean, null, objects, arrays).
// There wouldn't be cyclic objects, i.e. objects with circular references.

// deepEqual('foo', 'foo'); // true
// deepEqual({ id: 1 }, { id: 1 }); // true
// deepEqual([1, 2, 3], [1, 2, 3]); // true
// deepEqual([{ id: '1' }], [{ id: '2' }]); // false


/**
 * @param {*} valueA
 * @param {*} valueB
 * @return {boolean}
 */
export default function deepEqual(obj1, obj2) {
    if (!obj1 && !obj2) return obj1 === obj2;
    if (typeof obj1 !== typeof obj2) {
        return false;
    }
    if (typeof obj1 === typeof obj2) {
        if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }
    let keys = Object.keys(obj1);
    for (const key of keys) {
        //string,number,boolean
        switch (typeof obj1[key]) {
            case "object":
                return deepEqual(obj1[key], obj2[key]);
            default:
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
        }
    }
    return true;
}
