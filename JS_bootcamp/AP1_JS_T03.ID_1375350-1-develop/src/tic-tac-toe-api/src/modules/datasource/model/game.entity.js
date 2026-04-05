class GameEntity {
  constructor(id, board, status, winner, name) {
    this.id = id;
    this.board = board;
    this.status = status;
    this.winner = winner;
    this.name = name;
  }
}

module.exports = {
  GameEntity,
};
