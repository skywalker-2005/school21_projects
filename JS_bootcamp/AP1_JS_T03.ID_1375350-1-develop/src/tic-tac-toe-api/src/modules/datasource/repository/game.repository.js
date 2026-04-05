const { Injectable, Inject } = require('@nestjs/common');
const { toEntity, toDomain } = require('../mapper/domain-datasource.mapper');
const { GameStorage } = require('./game.storage');

@Injectable()
class GameRepository {
  constructor(@Inject(GameStorage) storage) {
    this.storage = storage;
  }

  save(game) {
    const entity = toEntity(game);
    const saved = this.storage.save(entity);
    return toDomain(saved);
  }

  get(id) {
    return toDomain(this.storage.get(id));
  }

  getAll() {
    return this.storage.getAll().map((entity) => toDomain(entity));
  }

  delete(id) {
    return this.storage.delete(id);
  }
}

module.exports = {
  GameRepository,
};
