function getFolderNames(names) {
  const map = new Map();
  const result = [];

  for (const name of names) {
    if (!map.has(name)) {
      result.push(name);
      map.set(name, 1);
    } else {
      let k = map.get(name);
      let newName = `${name}(${k})`;

      while (map.has(newName)) {
        k++;
        newName = `${name}(${k})`;
      }

      result.push(newName);
      map.set(name, k + 1);
      map.set(newName, 1);
    }
  }

  return result;
}
