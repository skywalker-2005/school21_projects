const BOARD_SIZE = 3;

class Board {
  constructor(matrix) {
    this.matrix = matrix;
  }

  static empty(size = BOARD_SIZE) {
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));
    return new Board(matrix);
  }

  static clone(board) {
    const matrix = board.matrix.map((row) => row.slice());
    return new Board(matrix);
  }
}

module.exports = {
  Board,
  BOARD_SIZE,
};
