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

    //iterate through keys
    for (const key of keys) {
        //string,number,boolean
        if (typeof obj1[key] === "object") {
            return deepEqual(obj1[key], obj2[key]);
        } else {
            if (obj1[key] !== obj2[key]) return false;
        }
    }
    return true;
}
