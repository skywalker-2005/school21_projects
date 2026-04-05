const GameStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  DRAW: 'DRAW',
  PLAYER_WON: 'PLAYER_WON',
  COMPUTER_WON: 'COMPUTER_WON',
};

class Game {
  constructor(id, board, status = GameStatus.IN_PROGRESS, winner = 0, name = '') {
    this.id = id;
    this.board = board;
    this.status = status;
    this.winner = winner;
    this.name = name;
  }
}

module.exports = {
  Game,
  GameStatus,
};
