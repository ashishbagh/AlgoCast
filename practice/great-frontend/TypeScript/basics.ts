function insertAtBegnining<T>(arr: T[], value: T) {
  return [value, ...arr];
}

let person: {
  name: string;
  age: number;
};

person = {
  name: "Ashish",
  age: 23,
};

// Union type

let course: string | number = "React Course";
course = 1233;

const updateArray = insertAtBegnining([1, 2, 3], 0);

const updateStringArray = insertAtBegnining(["a", "b", "c"], "e");

// let numbers = [1, 2, 3];

// In Typescript

let numbers: number[] = [1, 2, 3];

let arrNumbers: Array<number> = [1, 2, 3];

// Both are equal

class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}
  greet(): string {
    return this.name;
  }
}
