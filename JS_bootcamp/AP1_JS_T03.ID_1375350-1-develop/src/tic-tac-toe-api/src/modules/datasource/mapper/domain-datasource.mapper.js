const { Board } = require('../../domain/model/board');
const { Game } = require('../../domain/model/game');
const { BoardEntity } = require('../model/board.entity');
const { GameEntity } = require('../model/game.entity');

const cloneMatrix = (matrix) => matrix.map((row) => row.slice());

const toEntity = (game) => {
  if (!game) return null;
  const board = new BoardEntity(cloneMatrix(game.board.matrix));
  return new GameEntity(game.id, board, game.status, game.winner, game.name);
};

const toDomain = (entity) => {
  if (!entity) return null;
  const board = new Board(cloneMatrix(entity.board.matrix));
  return new Game(entity.id, board, entity.status, entity.winner, entity.name);
};

module.exports = {
  toEntity,
  toDomain,
};
