// By now you'd be familiar with mapping of elements in an array. If you aren't, please first do the Array.prototype.map question first.
// What if the mapping function is not a synchronous function i.e. it returns a promise? Array.prototype.map assumes the mapping function is synchronous and will fail to work properly.
// Implement a function mapAsync that accepts an array of items and maps each element with an asynchronous mapping function. The function should return a Promise which resolves to the mapped results.

// const asyncDouble = (x: number) =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(x * 2);
//     }, 10);
//   });

// const doubled = await mapAsync([1, 2], asyncDouble);
// console.log(doubled); // [2, 4]

/**
 * @param {Array<any>} iterable
 * @param {Function} callbackFn
 *
 * @return {Promise}
 */
export default function mapAsync(iterable, callbackFn) {
  const callBackProm = async (element) => {
    try {
      return await callbackFn.call(this, element);
    } catch (error) {
      throw error;
    }
  };

  let result = new Array(iterable.length);
  for (let i = 0; i < iterable.length; i++) {
    if (i in iterable) {
      result[i] = callBackProm(iterable[i]);
    }
  }

  return new Promise((resolve, reject) => {
    Promise.all(result)
      .then((values) => {
        resolve(values);
      })
      .catch((errors) => reject(errors));
  });
}
