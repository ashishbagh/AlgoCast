/**
 * @param {Array} iterable
 * @return {Promise}
 */
export default function promiseAny(iterable) {
  let errors = [];
  let counter = iterable.length;
  return new Promise((resolve, reject) => {
    if (counter === 0) reject(AggregateError(errors));
    for (const prom of iterable) {
      let isPromise = prom instanceof Promise;
      if (!isPromise) {
        resolve(prom);
      }
      prom
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          errors.push(error);
          counter--;
          if (counter === 0) reject(AggregateError(errors));
        });
    }
  });
}
