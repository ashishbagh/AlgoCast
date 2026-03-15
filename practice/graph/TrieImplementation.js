class TrieNode {
  constructor() {
    this.children = {}; // Stores child nodes, keys are characters, values are TrieNode instances
    this.isEndOfWord = false; // A flag to mark the end of a complete word
  }
}

class PrefixTree {
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * @param {string} word
   * @return {void}
   */
  insert(word) {
    // this.root = new PrefixTree();
    let current = this.root;

    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
    return true;
  }

  /**
   * @param {string} word
   * @return {boolean}
   */
  search(word) {
    let current = this.root;
    for (const char of word) {
      if (!current.children[char]) return false;
      current = current.children[char];
    }

    return current.isEndOfWord;
  }

  /**
   * @param {string} prefix
   * @return {boolean}
   */
  startsWith(prefix) {
    let current = this.root;
    for (const char of prefix) {
      if (!current.children[char]) return false;
      current = current.children[char];
    }
    return true;
  }
}
