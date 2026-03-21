// classnames is a commonly-used utility in modern front end applications to conditionally join CSS class names together. If you've written React applications, you likely have used a similar library.

// Implement the classnames function.

// classNames('foo', 'bar'); // 'foo bar'
// classNames('foo', { bar: true }); // 'foo bar'
// classNames({ 'foo-bar': true }); // 'foo-bar'
// classNames({ 'foo-bar': false }); // ''
// classNames({ foo: true }, { bar: true }); // 'foo bar'
// classNames({ foo: true, bar: true }); // 'foo bar'
// classNames({ foo: true, bar: false, qux: true }); // 'foo qux'

/**
 * @param {...(any|Object|Array<any|Object|Array>)} args
 * @return {string}
 */
export default function classNames(...args) {
  let result = [];

  const generate = (item) => {
    if (!item) return;

    if (typeof item === "string") {
      result.push(item);
      return;
    }

    if (typeof item === "number" && item !== 0) {
      result.push(item);
      return;
    }

    if (typeof item === "object" && Array.isArray(item)) {
      item.forEach((element) => generate(element));
      return;
    }

    if (typeof item === "object") {
      for (let key of Object.keys(item)) {
        if (typeof item[key] === "boolean") {
          if (item[key]) {
            result.push(key);
          }
          continue;
        }
        if (!item[key]) continue;
        generate(key);
      }
    }
    return;
  };

  generate(args);

  return result.join(" ");
}
