// You are free to use alternative approaches of
// defining UndoRedoManager as long as the
// default export can be instantiated.

/**
 * @template T
 */
export default class UndoRedoManager {
  /**
   * @param {T} initialValue
   */
  constructor(initialValue) {
    this.cache = new Map();
    this.pointer = 1;
    this.cache.set(this.pointer, initialValue);
  }

  /**
   * @returns {T}
   */
  getCurrent() {
    return this.cache.get(this.pointer);
  }

  /**
   * @param {T} value
   * @returns {void}
   */
  set(value) {
    this.pointer++;
    this.cache.set(this.pointer, value);
  }

  /**
   * @returns {void}
   */
  undo() {
    if (this.pointer > 1) this.pointer--;
  }

  /**
   * @returns {void}
   */
  redo() {
    if (this.cache.size === this.pointer) return;
    this.pointer++;
  }

  /**
   * @returns {void}
   */
  reset() {
    let initial = this.cache.get(1);
    this.cache = new Map();
    this.pointer = 1;
    this.cache.set(this.pointer, initial);
  }

  /**
   * @returns {boolean}
   */
  canUndo() {
    if (this.pointer > 1) return true;
    else return false;
  }

  /**
   * @returns {boolean}
   */
  canRedo() {
    if (this.pointer < this.cache.size) return true;
    else return false;
  }
}
