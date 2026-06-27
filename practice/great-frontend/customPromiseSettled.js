/**
 * @param {Array} iterable
 * @return {Promise<Array<{status: 'fulfilled', value: *}|{status: 'rejected', reason: *}>>}
 */
export default function promiseAllSettled(iterable) {
  let completed = 0;
  let result = [];
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      resolve([]);
      return;
    }
    for (let i in iterable) {
      Promise.resolve(iterable[i])
        .then((res) => {
          result[i] = { status: "fulfilled", value: res };
        })
        .catch((error) => {
          result[i] = { status: "rejected", reason: error };
        })
        .finally(() => {
          completed++;
          if (completed === iterable.length) {
            resolve(result);
          }
        });
    }
  });
}
