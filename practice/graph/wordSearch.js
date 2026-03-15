class Solution {
  /**
   * @param {character[][]} board
   * @param {string} word
   * @return {boolean}
   */
  exist(board, word) {
    let set = new Set();
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
        set.has(`${row},${col}`)
      ) {
        return false;
      }
      set.add(`${row},${col}`);
      const res =
        dfs(row + 1, col, l + 1) ||
        dfs(row - 1, col, l + 1) ||
        dfs(row, col + 1, l + 1) ||
        dfs(row, col - 1, l + 1);
      set.delete(`${row},${col}`);
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
