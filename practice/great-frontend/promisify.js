/**
 * @callback func
 * @returns Function
 */
export default function promisify(func) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            try {
                func.apply(this, [...args, (error, value) => {
                    if (error) reject(error);
                    else resolve(value);
                }]);
            } catch (error) {
                reject(error);
            }
        });
    };
}



// describe('use without await', () => {
//     function delayedResolve(cb: Function) {
//         setTimeout(() => {
//             cb(null, 42);
//         }, 10);
//     }
//     test('then', (done) => {
//         expect.assertions(1);
//         const promisified = promisify(delayedResolve);
//         promisified().then((res) => {
//             expect(res).toBe(42);
//             done();
//         });
//     });
// });