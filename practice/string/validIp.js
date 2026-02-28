// You are given a string s in the form of an IPv4 Address. Your task is to validate an IPv4 Address, if it is valid return true otherwise return false.

// IPv4 addresses are canonically represented in dot-decimal notation, which consists of four decimal numbers, each ranging from 0 to 255, separated by dots, e.g., "172.16.254.1"

// A valid IPv4 Address is of the form x1.x2.x3.x4 where 0 <= (x1, x2, x3, x4) <= 255. Thus, we can write the generalized form of an IPv4 address as (0-255).(0-255).(0-255).(0-255)

// Note: Here we are considering numbers only from 0 to 255 and any additional leading zeroes will be considered invalid.

// Examples :

// Input: s = "222.111.111.111"
// Output: true
// Explanation: Here, the IPv4 address is as per the criteria mentioned and also all four decimal numbers lies in the mentioned range.

const checkCondition = (element) => {
  if (element === "") {
    return false;
  }
  if (0 > element || element > 255) {
    return false;
  }
  if (element.length > 1 && element[0] === "0") {
    return false;
  }
  return true;
};

const validIP = (s) => {
  const arr = s.split(".");
  if (arr.length !== 4) {
    return false;
  }
  const result = arr.map((element) => checkCondition(element));
  return result.indexOf(false) === -1;
};

// console.log(validIP("222.111.111.111"));
//console.log(validIP("255..255.255"));
console.log(validIP("01.01.01.01"));
