/**
 * @param {any} thisArg
 * @param {...*} argArray
 * @return {Function}
 */
Function.prototype.myBind = function (thisArg, ...argArray) {
  let func = this;
  return function (...arg) {
    return func.apply(thisArg, [...argArray, ...arg]);
  };
};

/**
 * @param {any} thisArg
 * @param {...*} argArray
 * @return {any}
 */
Function.prototype.myCall = function (thisArg, ...argArray) {
  return this.apply(thisArg, argArray);
};

/**
 * Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.
 * @param thisArg The object to be used as the this object.
 * @param argArray A set of arguments to be passed to the function.
 * @return {any}
 */
Function.prototype.myApply = function (thisArg, argArray = []) {
  return this.call(thisArg, ...argArray);
};
