/**
 * @param {Array} iterable
 * @return {Promise<Array>}
 */
export default function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    let results = [];
    let counter = iterable.length;
    for (const prom of iterable) {
      let isPromise = prom instanceof Promise;
      if (!isPromise) {
        results.push(prom);
        counter--;
        if (counter === 0) resolve(results);
        continue;
      }
      prom
        .then((response) => {
          results.push(response);
          counter--;
          if (counter === 0) resolve(results);
        })
        .catch((error) => {
          results.push(error);
          reject(error);
        });
    }
    if (iterable.length === 0) {
      resolve([]);
    }
  });
}
