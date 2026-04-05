const { Injectable } = require('@nestjs/common');

@Injectable()
class GameStorage {
  constructor() {
    this.games = new Map();
  }

  save(gameEntity) {
    this.games.set(gameEntity.id, gameEntity);
    return gameEntity;
  }

  get(id) {
    return this.games.get(id) || null;
  }

  getAll() {
    return Array.from(this.games.values());
  }

  delete(id) {
    return this.games.delete(id);
  }
}

module.exports = {
  GameStorage,
};
