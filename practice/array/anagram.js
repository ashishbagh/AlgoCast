const anagramCheck = (s1, s2) => {
  // code here
  if (s1.length !== s2.length) {
    return false;
  }
  return s1.split("").sort().join("") === s2.split("").sort().join("");
};
