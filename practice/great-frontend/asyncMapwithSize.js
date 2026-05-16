/**
 * @param {Array<unknown>} iterable
 * @param {(value: unknown) => Promise<unknown>} callbackFn
 * @param {number} [size=Infinity]
 *
 * @return {Promise<Array<unknown>>}
 */
export default function mapAsyncLimit(iterable, callbackFn, size = Infinity) {
  let running = 0;
  let result = [];
  let arr = [...iterable];
  let rejected = false;
  return new Promise((resolve, reject) => {
    const task = async (p) => {
      try {
        let val = await callbackFn(p);
        result.push(val);
        return val;
      } catch (error) {
        if (!rejected) {
          reject(error);
        }
      } finally {
        console.log(running);
        running--;
        if (!rejected) {
          schedule();
        }
      }
    };
    function schedule() {
      if (iterable.length === result.length) {
        resolve(result);
        return;
      }
      while (arr.length > 0 && size > running) {
        let p = arr.shift();
        running++;
        task(p);
      }
    }

    schedule();
  });
}

let ongoing = 0;
console.log(
  mapAsyncLimit(
    [1, 2, 3, 4, 5],
    (x) => {
      ongoing++;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (ongoing > 2) {
            reject("Concurrency limit exceeded");
          }

          resolve(x * 2);
          ongoing--;
        }, 10);
      });
    },
    2,
  ).then((data) => console.log(data)),
);
