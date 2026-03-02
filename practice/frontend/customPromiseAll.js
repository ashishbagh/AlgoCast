/**
 * @param {Array} iterable
 * @return {Promise<Array>}
 */
export default function promiseAll(iterable) {
    let arr = iterable;
    return new Promise((resolve, reject) => {
        let results = [];
        let arrList = arr;
        let n = arr.length;
        for (let i = 0; i < n; i++) {
            arr[i]
                .then((result) => {
                    results.push(result);
                    arrList.pop();
                    if (arrList.length === 0) {
                        resolve(results);
                    }
                })
                .catch((error) => {
                    results.push(error);
                    reject(error);
                    // break;
                });
        }

        if (arr.length === 0) {
            resolve([]);
        }
    });
}