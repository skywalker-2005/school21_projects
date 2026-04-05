const { Injectable, Inject } = require('@nestjs/common');
const { randomUUID } = require('crypto');
const { Board, BOARD_SIZE } = require('../../domain/model/board');
const { Game, GameStatus } = require('../../domain/model/game');
const { GameRepository } = require('../repository/game.repository');

const PLAYER = 1;
const COMPUTER = 2;

const cloneMatrix = (matrix) => matrix.map((row) => row.slice());

const getWinner = (matrix) => {
  for (let i = 0; i < BOARD_SIZE; i += 1) {
    const row = matrix[i];
    if (row[0] !== 0 && row[0] === row[1] && row[1] === row[2]) return row[0];
    const col = matrix.map((r) => r[i]);
    if (col[0] !== 0 && col[0] === col[1] && col[1] === col[2]) return col[0];
  }
  const diag1 = [matrix[0][0], matrix[1][1], matrix[2][2]];
  if (diag1[0] !== 0 && diag1[0] === diag1[1] && diag1[1] === diag1[2]) return diag1[0];
  const diag2 = [matrix[0][2], matrix[1][1], matrix[2][0]];
  if (diag2[0] !== 0 && diag2[0] === diag2[1] && diag2[1] === diag2[2]) return diag2[0];
  return 0;
};

const isBoardFull = (matrix) => matrix.every((row) => row.every((cell) => cell !== 0));

const evaluateStatus = (matrix) => {
  const winner = getWinner(matrix);
  if (winner === PLAYER) return { finished: true, winner: PLAYER, status: GameStatus.PLAYER_WON };
  if (winner === COMPUTER) return { finished: true, winner: COMPUTER, status: GameStatus.COMPUTER_WON };
  if (isBoardFull(matrix)) return { finished: true, winner: 0, status: GameStatus.DRAW };
  return { finished: false, winner: 0, status: GameStatus.IN_PROGRESS };
};

const minimax = (matrix, isMaximizing) => {
  const result = evaluateStatus(matrix);
  if (result.finished) {
    if (result.winner === COMPUTER) return { score: 1 };
    if (result.winner === PLAYER) return { score: -1 };
    return { score: 0 };
  }

  let bestMove = null;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      if (matrix[r][c] !== 0) continue;
      matrix[r][c] = isMaximizing ? COMPUTER : PLAYER;
      const { score } = minimax(matrix, !isMaximizing);
      matrix[r][c] = 0;

      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = { r, c };
        }
      } else if (score < bestScore) {
        bestScore = score;
        bestMove = { r, c };
      }
    }
  }

  return { score: bestScore, move: bestMove };
};

@Injectable()
class GameServiceImpl {
  constructor(@Inject(GameRepository) repository) {
    this.repository = repository;
  }

  createGame(name = '') {
    const id = randomUUID();
    const board = Board.empty();
    const finalName = name && name.trim() ? name.trim() : id;
    const game = new Game(id, board, GameStatus.IN_PROGRESS, 0, finalName);
    return this.repository.save(game);
  }

  getGame(id) {
    return this.repository.get(id);
  }

  getAllGames() {
    return this.repository.getAll();
  }

  saveGame(game) {
    return this.repository.save(game);
  }

  deleteGame(id) {
    return this.repository.delete(id);
  }

  validateBoard(previousGame, updatedGame) {
    if (!updatedGame || !updatedGame.board || !Array.isArray(updatedGame.board.matrix)) {
      throw new Error('Некорректная структура игрового поля.');
    }

    const matrix = updatedGame.board.matrix;
    if (matrix.length !== BOARD_SIZE || matrix.some((row) => !Array.isArray(row) || row.length !== BOARD_SIZE)) {
      throw new Error('Поле должно быть матрицей 3x3.');
    }

    const prevMatrix = previousGame ? previousGame.board.matrix : Board.empty().matrix;
    let prevPlayer = 0;
    let prevComputer = 0;
    let nextPlayer = 0;
    let nextComputer = 0;

    for (let r = 0; r < BOARD_SIZE; r += 1) {
      for (let c = 0; c < BOARD_SIZE; c += 1) {
        const prev = prevMatrix[r][c];
        const next = matrix[r][c];

        if (![0, PLAYER, COMPUTER].includes(next)) {
          throw new Error('В поле допустимы только значения 0, 1, 2.');
        }

        if (prev !== 0 && next !== prev) {
          throw new Error('Нельзя изменять предыдущие ходы.');
        }

        if (prev === PLAYER) prevPlayer += 1;
        if (prev === COMPUTER) prevComputer += 1;
        if (next === PLAYER) nextPlayer += 1;
        if (next === COMPUTER) nextComputer += 1;
      }
    }

    if (previousGame && previousGame.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Игра уже завершена.');
    }

    if (prevPlayer !== prevComputer && prevPlayer !== prevComputer + 1) {
      throw new Error('Некорректное состояние предыдущей игры.');
    }

    const playerDiff = nextPlayer - prevPlayer;
    const computerDiff = nextComputer - prevComputer;

    if (playerDiff !== 1 || computerDiff !== 0) {
      throw new Error('Нужно сделать ровно один ход игрока.');
    }

    return true;
  }

  checkGameOver(game) {
    return evaluateStatus(game.board.matrix);
  }

  getNextMoveMinimax(game) {
    const status = this.checkGameOver(game);
    if (status.finished) {
      return new Game(game.id, game.board, status.status, status.winner, game.name);
    }

    const matrix = cloneMatrix(game.board.matrix);
    const { move } = minimax(matrix, true);

    if (move) {
      matrix[move.r][move.c] = COMPUTER;
    }

    const newBoard = new Board(matrix);
    const nextStatus = evaluateStatus(matrix);
    return new Game(game.id, newBoard, nextStatus.status, nextStatus.winner, game.name);
  }
}

module.exports = {
  GameServiceImpl,
  PLAYER,
  COMPUTER,
};
