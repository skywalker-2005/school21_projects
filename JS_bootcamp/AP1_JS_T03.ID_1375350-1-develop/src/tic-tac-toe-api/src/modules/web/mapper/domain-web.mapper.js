const { BoardDto } = require('../model/board.dto');
const { GameDto } = require('../model/game.dto');
const { Board } = require('../../domain/model/board');
const { Game } = require('../../domain/model/game');

const cloneMatrix = (matrix) => matrix.map((row) => row.slice());

const toDto = (game) => {
  if (!game) return null;
  const boardDto = new BoardDto(cloneMatrix(game.board.matrix));
  const finished = game.status !== 'IN_PROGRESS';
  return new GameDto(game.id, boardDto, game.status, game.winner, finished, game.name);
};

const toDomain = (dto) => {
  if (!dto) return null;
  const board = new Board(cloneMatrix(dto.board.matrix));
  return new Game(dto.id, board, dto.status, dto.winner, dto.name);
};

module.exports = {
  toDto,
  toDomain,
};
