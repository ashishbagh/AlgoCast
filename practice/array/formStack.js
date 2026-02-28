// Design a stack class that supports the push, pop, top, and getMin operations.

// MinStack() initializes the stack object.
// void push(int val) pushes the element val onto the stack.
// void pop() removes the element on the top of the stack.
// int top() gets the top element of the stack.
// int getMin() retrieves the minimum element in the stack.
// Each function should run in 
// O(1)
// O(1) time.

// Example 1:

// Input: ["MinStack", "push", 1, "push", 2, "push", 0, "getMin", "pop", "top", "getMin"]

// Output: [null,null,null,null,0,null,2,1]

// Explanation:
// MinStack minStack = new MinStack();
// minStack.push(1);
// minStack.push(2);
// minStack.push(0);
// minStack.getMin(); // return 0
// minStack.pop();
// minStack.top();    // return 2
// minStack.getMin(); // return 1


class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  /**
   * @param {number} val
   * @return {void}
   */
  push(val) {
    let minVal = this.getMin() === undefined ? Infinity : this.getMin();
    this.minStack.push(Math.min(val, minVal));
    this.stack.push(val);
  }

  /**
   * @return {void}
   */
  pop() {
    this.minStack.pop();
    return this.stack.pop();
  }

  /**
   * @return {number}
   */
  top() {
    let n = this.stack.length;
    return this.stack[n - 1];
  }

  /**
   * @return {number}
   */
  getMin() {
    let n = this.minStack.length;
    return this.minStack[n - 1];
  }
}
