/**
 * @param {Array} iterable
 * @return {Promise<Array>}
 */
export default function promiseAll(iterable) {
  let result = [];
  let completed = 0;
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      resolve(result);
      return;
    }
    for (let i = 0; i < iterable.length; i++) {
      const prom = iterable[i];
      Promise.resolve(prom)
        .then((response) => {
          result[i] = response;
          completed++;
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          if (completed === iterable.length) {
            resolve(result);
          }
        });
    }
  });
}
