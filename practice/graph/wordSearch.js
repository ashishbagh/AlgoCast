// Given a 2-D grid of characters board and a string word, return true if the word is present in the grid, otherwise return false.

// For the word to be present it must be possible to form it with a path in the board with horizontally or vertically neighboring cells. The same cell may not be used more than once in a word.
// Input:
// board = [
//   ["A","B","C","D"],
//   ["S","A","A","T"],
//   ["A","C","A","E"]
// ],
// word = "CAT"

// Output: true

class Solution {
  /**
   * @param {character[][]} board
   * @param {string} word
   * @return {boolean}
   */
  exist(board, word) {
    let visit = new Set();
    let r = board.length;
    let c = board[0].length;
    const dfs = (row, col, l) => {
      if (l === word.length) return true;
      if (
        row < 0 ||
        col < 0 ||
        row >= r ||
        col >= c ||
        board[row][col] !== word[l] ||
        visit.has(`${row},${col}`)
      ) {
        return false;
      }
      visit.add(`${row},${col}`);
      const res =
        dfs(row + 1, col, l + 1) ||
        dfs(row - 1, col, l + 1) ||
        dfs(row, col + 1, l + 1) ||
        dfs(row, col - 1, l + 1);
      visit.delete(`${row},${col}`);
      return res;
    };
    let l = 0;
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        // if(board[i][j] === word[l]){
        if (dfs(i, j, l)) return true;
        // }
      }
    }
    return false;
  }
}
