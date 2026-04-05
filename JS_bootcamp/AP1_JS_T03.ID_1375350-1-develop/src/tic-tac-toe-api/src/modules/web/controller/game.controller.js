const {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  HttpException,
  HttpStatus,
  Inject,
} = require('@nestjs/common');
const { GAME_SERVICE } = require('../../domain/service/game-service.token');
const { toDto } = require('../mapper/domain-web.mapper');
const { Board } = require('../../domain/model/board');
const { Game } = require('../../domain/model/game');

@Controller()
class GameController {
  @Inject(GAME_SERVICE)
  gameService;

  @Post('game')
  createGame(@Body() body) {
    const name = body && typeof body.name === 'string' ? body.name.trim() : '';
    const game = this.gameService.createGame(name);
    return toDto(game);
  }

  @Get('games')
  listGames() {
    const games = this.gameService.getAllGames().map((game) => toDto(game));
    return {
      active: games.filter((game) => !game.finished),
      finished: games.filter((game) => game.finished),
    };
  }

  @Delete('game/:id')
  deleteGame(@Param('id') id) {
    const existing = this.gameService.getGame(id);
    if (!existing) {
      throw new HttpException('Игра не найдена.', HttpStatus.NOT_FOUND);
    }
    this.gameService.deleteGame(id);
    return { deleted: true, id };
  }

  @Post('game/:id')
  updateGame(@Param('id') id, @Body() dto) {
    const existing = this.gameService.getGame(id);
    if (!existing) {
      throw new HttpException('Игра не найдена.', HttpStatus.NOT_FOUND);
    }
    if (!dto || !dto.board || !Array.isArray(dto.board.matrix)) {
      throw new HttpException('Некорректное тело запроса.', HttpStatus.BAD_REQUEST);
    }

    const board = new Board(dto.board.matrix);
    const updatedGame = new Game(id, board, existing.status, existing.winner, existing.name);

    try {
      this.gameService.validateBoard(existing, updatedGame);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    const statusAfterPlayer = this.gameService.checkGameOver(updatedGame);
    let nextGame;

    if (statusAfterPlayer.finished) {
      nextGame = new Game(
        id,
        updatedGame.board,
        statusAfterPlayer.status,
        statusAfterPlayer.winner,
        existing.name,
      );
    } else {
      nextGame = this.gameService.getNextMoveMinimax(updatedGame);
    }

    const saved = this.gameService.saveGame(nextGame);
    return toDto(saved);
  }
}

module.exports = {
  GameController,
};
