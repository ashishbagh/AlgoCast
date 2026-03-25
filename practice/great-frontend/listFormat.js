// Given a list of strings, implement a function listFormat that returns the items concatenated into a single string. A common use case would be in summarizing the reactions for social media posts.

// The function should support a few options as the second parameter:

// sorted: Sorts the items by alphabetical order.
// length: Show only the first length items, using "and X other(s)" for the remaining. Ignore invalid values (negative, 0, etc).
// unique: Remove duplicate items.

/**
 * @param {Array<string>} items
 * @param {{sorted?: boolean, length?: number, unique?: boolean}} [options]
 * @return {string}
 */

/// before last charac "And"
// for Sort true sort data first
// length define then only that much length and "count of rest need to be shown"
export default function listFormat(items, options = {}) {
  const { length = false, sorted = false, unique = false } = options;

  if (items.length <= 1) {
    return items.join("");
  }

  if (sorted) {
    items = items.sort();
  }

  let showArr = [...items];

  if (unique) {
    let setVar = new Set(showArr);
    showArr = [];
    for (const item of setVar.values()) {
      showArr.push(item);
    }
  }

  let endStr = "and";

  if (!length || items.length < length || length < 0) {
    let temp = showArr.pop();
    endStr = endStr + " " + temp;
    temp = showArr.pop();
    showArr.push(temp + " " + endStr);
    return showArr.filter((item) => item !== "").join(", ");
  }

  let resultArr = [];
  let counter = 0;
  while (counter < length && counter < showArr.length) {
    if (showArr[counter] !== "") {
      resultArr.push(showArr[counter]);
      counter++;
    }
  }

  if (showArr.length - length > 0)
    endStr =
      endStr +
      ` ${showArr.length - length} ${showArr.length - length === 1 ? "other" : "others"}`;

  let temp = resultArr.pop();
  resultArr.push(temp + " " + endStr);
  return resultArr.filter((item) => item !== " ").join(", ");
}
