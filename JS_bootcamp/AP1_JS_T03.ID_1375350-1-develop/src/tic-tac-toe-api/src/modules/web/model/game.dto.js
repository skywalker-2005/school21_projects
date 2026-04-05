class GameDto {
  constructor(id, board, status, winner, finished, name) {
    this.id = id;
    this.board = board;
    this.status = status;
    this.winner = winner;
    this.finished = finished;
    this.name = name;
  }
}

module.exports = {
  GameDto,
};
