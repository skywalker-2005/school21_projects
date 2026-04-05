///////////////
// КОНСТАНТЫ //
///////////////

const STRENGTH_LOW = 5;
const STRENGTH_MEDIUM = 10;
const STRENGTH_HIGH = 15;
const STRENGTH_VERY_HIGH = 20;

const AGILITY_LOW = 5;
const AGILITY_MEDIUM = 10;
const AGILITY_HIGH = 15;
const AGILITY_VERY_HIGH = 20;

const HEALTH_LOW = 10;
const HEALTH_MEDIUM = 20;
const HEALTH_HIGH = 30;
const HEALTH_VERY_HIGH = 40;

const HOSTILITY_LOW = 1;
const HOSTILITY_MEDIUM = 3;
const HOSTILITY_HIGH = 5;

const DIFFICULTY_LOW = 1;
const DIFFICULTY_MEDIUM = 3;
const DIFFICULTY_HIGH = 5;

const DEFAULT_POTION_DURATION = 30;

///////////////////////////
// ЛЮБОЙ ОБЪЕКТ НА КАРТЕ //
///////////////////////////

class Actor {
  constructor(x, y, char, color = "white") {
    this.x = x;
    this.y = y;
    this.char = char;
    this.color = color;
  }
}

/////////////
// ПРЕДМЕТ //
/////////////

class Item extends Actor {
  constructor(x, y, type, subtype) {
    super(x, y, "?", "blue");
    this.type = type;
    this.subtype = subtype;
    this.strength = 0;
    this.agility = 0;
    this.health = 0;
    this.maxHealth = 0;
    this.duration = 0;
    this.difficulty = 0;
    switch (type) {
      case "food":
        this.char = "f";
        break;
      case "potion":
        this.char = "p";
        this.duration = DEFAULT_POTION_DURATION;
        break;
      case "scroll":
        this.char = "s";
        break;
      case "weapon":
        this.char = "w";
        break;
      case "key":
        this.char = "H";
        break;
      default:
        this.char = "?";
        break;
    }
    switch (subtype) {
      // Еда
      case "Apple":
        this.health = 5;
        break;
      case "Wine":
        this.health = 8;
        break;
      case "Cheese":
        this.health = 10;
        break;
      case "Chicken":
        this.health = 12;
        break;
      case "Stew":
        this.health = 15;
        break;
      case "Steak":
        this.health = 20;
        break;

      // Зелья
      case "Lesser Potion of Strength":
        this.strength = STRENGTH_LOW;
        break;
      case "Medium Potion of Strength":
        this.strength = STRENGTH_MEDIUM;
        break;
      case "Great Potion of Strength":
        this.strength = STRENGTH_HIGH;
        break;

      case "Lesser Potion of Agility":
        this.agility = AGILITY_LOW;
        break;
      case "Medium Potion of Agility":
        this.agility = AGILITY_MEDIUM;
        break;
      case "Great Potion of Agility":
        this.agility = AGILITY_HIGH;
        break;

      case "Lesser Potion of Health":
        this.maxHealth = HEALTH_LOW;
        break;
      case "Medium Potion of Health":
        this.maxHealth = HEALTH_MEDIUM;
        break;
      case "Great Potion of Health":
        this.maxHealth = HEALTH_HIGH;
        break;

      // Свитки
      case "Lesser Scroll of Strength":
        this.strength = STRENGTH_LOW;
        this.difficulty = DIFFICULTY_LOW;
        break;
      case "Medium Scroll of Strength":
        this.strength = STRENGTH_MEDIUM;
        this.difficulty = DIFFICULTY_MEDIUM;
        break;
      case "Great Scroll of Strength":
        this.strength = STRENGTH_HIGH;
        this.difficulty = DIFFICULTY_HIGH;
        break;

      case "Lesser Scroll of Agility":
        this.agility = AGILITY_LOW;
        this.difficulty = DIFFICULTY_LOW;
        break;
      case "Medium Scroll of Agility":
        this.agility = AGILITY_MEDIUM;
        this.difficulty = DIFFICULTY_MEDIUM;
        break;
      case "Great Scroll of Agility":
        this.agility = AGILITY_HIGH;
        this.difficulty = DIFFICULTY_HIGH;
        break;

      case "Lesser Scroll of Health":
        this.maxHealth = HEALTH_LOW;
        this.difficulty = DIFFICULTY_LOW;
        break;
      case "Medium Scroll of Health":
        this.maxHealth = HEALTH_MEDIUM;
        this.difficulty = DIFFICULTY_MEDIUM;
        break;
      case "Great Scroll of Health":
        this.maxHealth = HEALTH_HIGH;
        this.difficulty = DIFFICULTY_HIGH;
        break;

      // Оружие
      case "Dagger":
        this.strength = 5;
        break;
      case "Short Sword":
        this.strength = 10;
        break;
      case "Long Sword":
        this.strength = 15;
        break;
      case "Battle Axe":
        this.strength = 20;
        break;
      case "Great Sword":
        this.strength = 25;
        break;
      case "Legendary Sword":
        this.strength = 30;
        break;

      // Ключи
      case "Red Key":
        this.color = "red";
        break;
      case "Yellow Key":
        this.color = "yellow";
        break;
    }
  }
}

///////////
// ИГРОК //
///////////

class Player extends Actor {
  constructor(x, y) {
    super(x, y, "@", "yellow");
    this.strength = STRENGTH_MEDIUM;
    this.agility = AGILITY_MEDIUM;
    this.health = HEALTH_MEDIUM;
    this.maxHealth = HEALTH_MEDIUM;
    this.gold = 0;
    this.food = [];
    this.potions = [];
    this.scrolls = [];
    this.weapons = [];
    this.weapon = null;
    this.activeEffects = [];
    this.sleep = false;
    this.keys = [];
    this.viewAngle = 0;
    this.fov = Math.PI / 3;
    this.viewDistance = 20;
  }

  rotate(delta) {
    this.viewAngle += delta;
    const twoPi = Math.PI * 2;
    if (this.viewAngle < 0) this.viewAngle += twoPi;
    if (this.viewAngle >= twoPi) this.viewAngle -= twoPi;
  }

  getFacingVector() {
    const dx = Math.round(Math.sin(this.viewAngle));
    const dy = Math.round(Math.cos(this.viewAngle));
    return { dx, dy };
  }

  hasKey(color) {
    const keyName =
      color == "red"
        ? "Red Key"
        : color == "blue"
          ? "Blue Key"
          : color == "yellow"
            ? "Yellow Key"
            : null;
    if (!keyName) return false;
    return this.keys.some((key) => key.subtype == keyName);
  }

  clearKeys() {
    this.keys = [];
  }

  getCategory(type) {
    switch (type) {
      case "food":
        return this.food;
      case "potion":
        return this.potions;
      case "scroll":
        return this.scrolls;
      case "weapon":
        return this.weapons;
      case "key":
        return this.keys;
      default:
        return null;
    }
  }

  increaseStats(item) {
    if (item.strength > 0) this.strength += item.strength;
    if (item.agility > 0) this.agility += item.agility;
    if (item.maxHealth > 0) {
      this.maxHealth += item.maxHealth;
      this.health = this.health + item.maxHealth;
    }
  }

  useItem(item) {
    switch (item.type) {
      case "food":
        this.health = Math.min(this.health + item.health, this.maxHealth);
        break;

      case "potion":
        const effect = {
          type: null,
          amount: 0,
          remainingTurns: item.duration,
          originalStat: 0,
        };

        if (item.strength > 0) {
          effect.type = "strength";
          effect.amount = item.strength;
          effect.originalStat = this.strength;
          this.strength += item.strength;
        } else if (item.agility > 0) {
          effect.type = "agility";
          effect.amount = item.agility;
          effect.originalStat = this.agility;
          this.agility += item.agility;
        } else if (item.maxHealth > 0) {
          effect.type = "maxHealth";
          effect.amount = item.maxHealth;
          effect.originalStat = this.maxHealth;
          this.maxHealth += item.maxHealth;
          this.health += item.maxHealth;
        }

        if (effect.type) {
          this.activeEffects.push(effect);
        }

        this.increaseStats(item);

        break;

      case "scroll":
        this.increaseStats(item);
        break;

      case "weapon":
        this.weapon = item;
        break;
    }

    return item.difficulty;
  }

  updateEffects() {
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      const effect = this.activeEffects[i];
      effect.remainingTurns--;

      if (effect.remainingTurns <= 0) {
        switch (effect.type) {
          case "strength":
            this.strength -= effect.amount;
            break;
          case "agility":
            this.agility -= effect.amount;
            break;
          case "maxHealth":
            this.maxHealth -= effect.amount;
            if (this.health > this.maxHealth) {
              this.health = this.maxHealth;
            }
            break;
        }
        this.activeEffects.splice(i, 1);
      }
    }
  }

  getActiveEffects() {
    return this.activeEffects.map((effect) => ({
      type: effect.type,
      amount: effect.amount,
      remainingTurns: effect.remainingTurns,
    }));
  }

  hasActiveEffects() {
    return this.activeEffects.length > 0;
  }

  addItem(item) {
    const category = this.getCategory(item.type);
    if (category.length >= 9) return false;
    category.push(item);
    return true;
  }

  removeItem(type, index) {
    const category = this.getCategory(type);
    if (index < 0 || index >= category.length) return null;
    return category.splice(index, 1)[0];
  }

  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }

  reduceMaxHeath(amount) {
    this.maxHealth -= amount;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
  }

  sleep() {
    this.sleep = true;
  }

  attack(target) {
    let hit = false;
    let damage = 0;
    if (target instanceof Enemy) {
      if (Math.random() < this.agility / (this.agility + target.agility)) {
        hit = true;
        damage = this.strength + (this.weapon ? this.weapon.strength : 0);
      }
    }
    return { hit: hit, damage: damage };
  }

  move(dx, dy, level) {
    if (this.sleep) {
      this.sleep = false;
      return { success: false, message: "Woke up" };
    }

    const newX = this.x + dx;
    const newY = this.y + dy;

    if (!level.isWalkable(newX, newY)) {
      return { success: false, message: "There is a wall" };
    }

    if (level.isExitCell(newX, newY)) {
      this.x = newX;
      this.y = newY;
      return { success: true, action: "exit", target: null };
    }

    const target = level.getActorAt(newX, newY);

    if (target instanceof Enemy) {
      return { success: true, action: "attack", target: target };
    } else if (target instanceof Item) {
      this.x = newX;
      this.y = newY;
      return {
        success: true,
        action: "pickup",
        target: target,
      };
    } else {
      this.x = newX;
      this.y = newY;
      return { success: true, action: "move" };
    }
  }

  restoreInventory(savedInventory) {
    if (savedInventory.food) {
      this.food = savedInventory.food.map(
        (itemData) => new Item(0, 0, "food", itemData.subtype),
      );
    }

    if (savedInventory.potions) {
      this.potions = savedInventory.potions.map(
        (itemData) => new Item(0, 0, "potion", itemData.subtype),
      );
    }

    if (savedInventory.scrolls) {
      this.scrolls = savedInventory.scrolls.map(
        (itemData) => new Item(0, 0, "scroll", itemData.subtype),
      );
    }

    if (savedInventory.weapons) {
      this.weapons = savedInventory.weapons.map(
        (itemData) => new Item(0, 0, "weapon", itemData.subtype),
      );
    }

    if (savedInventory.weapon) {
      this.weapon = new Item(0, 0, "weapon", savedInventory.weapon.subtype);
    }
  }
}

///////////////
// ПРОТИВНИК //
///////////////

class Enemy extends Actor {
  constructor(x, y, char, color, room = null) {
    super(x, y, char, color);
    this.strength = 0;
    this.agility = 0;
    this.health = 0;
    this.hostility = 0;
    this.delay = 0;
    this.baseDelay = 0;
    this.room = room;
    this.difficulty = 0;
  }

  getDistanceToPlayer(player) {
    return Math.abs(this.x - player.x) + Math.abs(this.y - player.y);
  }

  getDirectionToPlayer(player) {
    return { x: Math.sign(player.x - this.x), y: Math.sign(player.y - this.y) };
  }

  canMoveTo(x, y, level) {
    return level.isWalkable(x, y) && !level.getActorAt(x, y);
  }

  isPlayerInSameRoom(player) {
    if (!this.room) return true;
    return (
      player.x >= this.room.x &&
      player.x < this.room.x + this.room.width &&
      player.y >= this.room.y &&
      player.y < this.room.y + this.room.height
    );
  }

  findPathStep(player, level) {
    const directions = [
      { x: Math.sign(player.x - this.x), y: 0 },
      { x: 0, y: Math.sign(player.y - this.y) },
    ];

    if (Math.random() < 0.5) directions.reverse();

    for (const dir of directions) {
      const newX = this.x + dir.dx;
      const newY = this.y + dir.dy;
      if (this.canMoveTo(newX, newY, level)) {
        return { x: newX, y: newY };
      }
    }

    const allDirections = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    for (const dir of allDirections) {
      const newX = this.x + dir.dx;
      const newY = this.y + dir.dy;
      if (this.canMoveTo(newX, newY, level)) {
        return { x: newX, y: newY };
      }
    }

    return null;
  }

  getRandomCellNearby(level) {
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    for (const dir of directions) {
      const newX = this.x + dir.dx;
      const newY = this.y + dir.dy;
      if (this.canMoveTo(newX, newY, level)) {
        return { x: newX, y: newY };
      }
    }

    return null;
  }

  idle(level) {
    if (this.delay > 0) {
      this.delay--;
    } else {
      const newPos = this.getRandomCellNearby(level);
      if (newPos) {
        this.x = newPos.x;
        this.y = newPos.y;
      }
      this.delay = this.baseDelay;
    }
  }

  chasePlayer(player, level) {
    if (this.delay > 0) {
      this.delay--;
      return;
    }

    const pathStep = this.findPathStep(player, level);
    if (pathStep) {
      this.x = pathStep.x;
      this.y = pathStep.y;
    }
    this.delay = this.baseDelay;
  }

  attack(target) {
    let hit = false;
    let damage = 0;
    if (target instanceof Player) {
      if (Math.random() < this.agility / (this.agility + target.agility)) {
        hit = true;
        damage = this.strength;
      }
    }
    return { hit: hit, damage: damage, difficulty: this.difficulty };
  }

  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }

  act(player, level) {
    if (!level.isWalkable(this.x, this.y)) {
      if (this.room) {
        for (let y = this.room.y; y < this.room.y + this.room.height; y++) {
          for (let x = this.room.x; x < this.room.x + this.room.width; x++) {
            if (level.isWalkable(x, y) && !level.getActorAt(x, y)) {
              this.x = x;
              this.y = y;
              return;
            }
          }
        }
      }
      return;
    }

    if (this.isPlayerInSameRoom(player)) {
      const distance = this.getDistanceToPlayer(player);
      if (distance <= this.hostility) {
        if (distance == 1) {
          return;
        } else {
          this.chasePlayer(player, level);
        }
      } else {
        this.idle(level);
      }
    } else {
      this.idle(level);
    }
  }

  canMoveTo(x, y, level) {
    if (x < 0 || y < 0 || x >= 100 || y >= 100) return false;
    if (!level.isWalkable(x, y)) return false;
    if (level.getActorAt(x, y)) return false;
    if (this.room) {
      const isInSameRoom =
        x >= this.room.x &&
        x < this.room.x + this.room.width &&
        y >= this.room.y &&
        y < this.room.y + this.room.height;

      if (!isInSameRoom) return false;
    }

    return true;
  }
}

///////////
// ЗОМБИ //
///////////

class Zombie extends Enemy {
  constructor(x, y) {
    super(x, y, "z", "green");
    this.strength = STRENGTH_MEDIUM;
    this.agility = AGILITY_LOW;
    this.health = HEALTH_HIGH;
    this.hostility = HOSTILITY_MEDIUM;
    this.delay = this.baseDelay = 5;
    this.difficulty = 1;
  }
}

////////////
// ВАМПИР //
////////////

class Vampire extends Enemy {
  constructor(x, y) {
    super(x, y, "v", "red");
    this.strength = STRENGTH_MEDIUM;
    this.agility = AGILITY_HIGH;
    this.health = HEALTH_HIGH;
    this.hostility = HOSTILITY_HIGH;
    this.delay = this.baseDelay = 3;
    this.difficulty = 5;
    this.firstAttack = true;
    this.isDead = false;
  }

  attack(target) {
    const result = super.attack(target);
    if (result.hit && target instanceof Player) target.reduceMaxHeath(1);
    return result;
  }

  takeDamage(amount) {
    if (this.isDead) return true;

    if (this.firstAttack) {
      this.firstAttack = false;
      amount = 0;
    }

    this.health -= amount;

    if (this.health <= 0) {
      this.isDead = true;
      return true;
    }

    return false;
  }
}

/////////////
// ПРИЗРАК //
/////////////

class Ghost extends Enemy {
  constructor(x, y) {
    super(x, y, "g", "white");
    this.strength = STRENGTH_LOW;
    this.agility = AGILITY_HIGH;
    this.health = HEALTH_LOW;
    this.hostility = HOSTILITY_LOW;
    this.delay = this.baseDelay = 2;
    this.difficulty = 1;
    this.invisible = false;
    this.beforeFight = true;
  }

  idle(level) {
    if (!this.invisible) {
      if (Math.random() < 0.2) this.invisible = true;
    }

    if (this.invisible) {
      if (Math.random() < 0.4) this.invisible = false;
      return;
    }

    if (this.delay > 0) {
      this.delay--;
    } else {
      const rooms = level.rooms;
      if (rooms.length > 0) {
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const x = room.x + Math.floor(Math.random() * room.width);
        const y = room.y + Math.floor(Math.random() * room.height);
        if (!level.getActorAt(x, y) && level.isWalkable(x, y)) {
          this.x = x;
          this.y = y;
        }
      }
      this.delay = this.baseDelay;
    }
  }
}

/////////
// ОГР //
/////////

class Ogre extends Enemy {
  constructor(x, y) {
    super(x, y, "O", "yellow");
    this.strength = STRENGTH_VERY_HIGH;
    this.agility = AGILITY_LOW;
    this.health = HEALTH_VERY_HIGH;
    this.hostility = HOSTILITY_MEDIUM;
    this.delay = this.baseDelay = 3;
    this.difficulty = 5;
    this.resting = false;
  }

  attack(target) {
    if (this.resting) {
      this.resting = false;
      return { hit: false, damage: 0, message: "огр отдыхает" };
    }
    const result = super.attack(target);
    this.resting = true;
    return result;
  }

  canMoveTo(x, y, level) {
    if (x < 0 || y < 0 || x >= 100 || y >= 100) return false;
    return level.isWalkable(x, y) && !level.getActorAt(x, y);
  }

  findPathStep(player, level) {
    const directions = [
      { dx: Math.sign(player.x - this.x), dy: 0 },
      { dx: 0, dy: Math.sign(player.y - this.y) },
    ];

    if (Math.random() < 0.5) directions.reverse();

    for (const dir of directions) {
      const newX = this.x + dir.dx;
      const newY = this.y + dir.dy;
      if (this.canMoveTo(newX, newY, level)) {
        return { x: newX, y: newY };
      }
    }

    const allDirections = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    for (const dir of allDirections) {
      const newX = this.x + dir.dx;
      const newY = this.y + dir.dy;
      if (this.canMoveTo(newX, newY, level)) {
        return { x: newX, y: newY };
      }
    }

    return null;
  }

  chasePlayer(player, level) {
    if (this.delay > 0) {
      this.delay--;
      return;
    }

    if (!level.isWalkable(this.x, this.y)) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const newX = this.x + dx;
          const newY = this.y + dy;
          if (level.isWalkable(newX, newY) && !level.getActorAt(newX, newY)) {
            this.x = newX;
            this.y = newY;
            this.delay = this.baseDelay;
            return;
          }
        }
      }
      this.delay = this.baseDelay;
      return;
    }

    let moved = false;

    for (let step = 0; step < 2; step++) {
      const pathStep = this.findPathStep(player, level);
      if (pathStep) {
        if (
          level.isWalkable(pathStep.x, pathStep.y) &&
          !level.getActorAt(pathStep.x, pathStep.y)
        ) {
          this.x = pathStep.x;
          this.y = pathStep.y;
          moved = true;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    if (moved) {
      this.delay = this.baseDelay;
    } else {
      const randomMove = this.getRandomCellNearby(level);
      if (
        randomMove &&
        level.isWalkable(randomMove.x, randomMove.y) &&
        !level.getActorAt(randomMove.x, randomMove.y)
      ) {
        this.x = randomMove.x;
        this.y = randomMove.y;
      }
      this.delay = this.baseDelay;
    }
  }
}

//////////
// ЗМЕЙ //
//////////

class Snake extends Enemy {
  constructor(x, y) {
    super(x, y, "s", "white");
    this.strength = STRENGTH_MEDIUM;
    this.agility = AGILITY_VERY_HIGH;
    this.health = HEALTH_MEDIUM;
    this.hostility = HOSTILITY_HIGH;
    this.delay = this.baseDelay = 1;
    this.difficulty = 3;
    const directions = [
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ];
    this.direction = directions[Math.floor(Math.random() * directions.length)];
  }

  canMoveTo(x, y, level) {
    if (x < 0 || y < 0 || x >= 100 || y >= 100) return false;
    if (!level.isWalkable(x, y) || level.getActorAt(x, y)) return false;
    return this.canMoveDiagonally(x, y, level);
  }

  canMoveDiagonally(x, y, level) {
    const isDiagonal = Math.abs(x - this.x) == 1 && Math.abs(y - this.y) == 1;
    if (!isDiagonal) return true;
    const horizontalWalkable =
      level.isWalkable(x, this.y) && !level.getActorAt(x, this.y);
    const verticalWalkable =
      level.isWalkable(this.x, y) && !level.getActorAt(this.x, y);
    return horizontalWalkable || verticalWalkable;
  }

  idle(level) {
    if (!level.isWalkable(this.x, this.y)) {
      if (this.room) {
        for (let y = this.room.y; y < this.room.y + this.room.height; y++) {
          for (let x = this.room.x; x < this.room.x + this.room.width; x++) {
            if (level.isWalkable(x, y) && !level.getActorAt(x, y)) {
              this.x = x;
              this.y = y;
              return;
            }
          }
        }
      }
      return;
    }

    const newX = this.x + this.direction.dx;
    const newY = this.y + this.direction.dy;

    if (this.canMoveTo(newX, newY, level)) {
      this.x = newX;
      this.y = newY;
    } else {
      const diagonalDirections = [
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 },
      ];

      for (let i = diagonalDirections.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [diagonalDirections[i], diagonalDirections[j]] = [
          diagonalDirections[j],
          diagonalDirections[i],
        ];
      }

      for (const dir of diagonalDirections) {
        const testX = this.x + dir.dx;
        const testY = this.y + dir.dy;
        if (this.canMoveTo(testX, testY, level)) {
          this.direction.dx = dir.dx;
          this.direction.dy = dir.dy;
          this.x = testX;
          this.y = testY;
          return;
        }
      }

      const straightDirections = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
      ];

      for (const dir of straightDirections) {
        const testX = this.x + dir.dx;
        const testY = this.y + dir.dy;
        if (this.canMoveTo(testX, testY, level)) {
          this.direction.dx = dir.dx;
          this.direction.dy = dir.dy;
          this.x = testX;
          this.y = testY;
          return;
        }
      }
    }
  }

  chasePlayer(player, level) {
    if (!level.isWalkable(this.x, this.y)) {
      if (this.room) {
        for (let y = this.room.y; y < this.room.y + this.room.height; y++) {
          for (let x = this.room.x; x < this.room.x + this.room.width; x++) {
            if (level.isWalkable(x, y) && !level.getActorAt(x, y)) {
              this.x = x;
              this.y = y;
              return;
            }
          }
        }
      }
      return;
    }

    if (!this.isPlayerInSameRoom(player)) {
      this.idle(level);
      return;
    }

    const dx = Math.sign(player.x - this.x);
    const dy = Math.sign(player.y - this.y);

    if (dx != 0 && dy != 0) {
      const newX = this.x + dx;
      const newY = this.y + dy;
      if (this.canMoveTo(newX, newY, level)) {
        this.x = newX;
        this.y = newY;
        this.direction.dx = dx;
        this.direction.dy = dy;
        return;
      }
    }

    if (dx != 0) {
      const newX = this.x + dx;
      const newY = this.y;
      if (this.canMoveTo(newX, newY, level)) {
        this.x = newX;
        this.y = newY;
        this.direction.dx = dx;
        this.direction.dy = 0;
        return;
      }
    }

    if (dy != 0) {
      const newX = this.x;
      const newY = this.y + dy;
      if (this.canMoveTo(newX, newY, level)) {
        this.x = newX;
        this.y = newY;
        this.direction.dx = 0;
        this.direction.dy = dy;
        return;
      }
    }

    this.idle(level);
  }

  attack(target) {
    const result = super.attack(target);
    if (result.hit && target instanceof Player)
      if (Math.random() > 0.5 && target.sleep) target.sleep();
    return result;
  }
}

///////////
// МИМИК //
///////////

class Mimic extends Enemy {
  constructor(x, y) {
    super(x, y, ["f", "p", "s", "w"][Math.floor(Math.random() * 4)], "blue");
    this.strength = STRENGTH_LOW;
    this.agility = AGILITY_HIGH;
    this.health = HEALTH_HIGH;
    this.hostility = HOSTILITY_LOW;
    this.difficulty = 1;
  }

  attack(target) {
    if (this.char != "m") {
      this.char = "m";
      this.color = "white";
    }
    return super.attack(target);
  }

  idle(level) {}
  chasePlayer(player, level) {}
}

export {
  STRENGTH_LOW,
  STRENGTH_MEDIUM,
  STRENGTH_HIGH,
  STRENGTH_VERY_HIGH,
  AGILITY_LOW,
  AGILITY_MEDIUM,
  AGILITY_HIGH,
  AGILITY_VERY_HIGH,
  HEALTH_LOW,
  HEALTH_MEDIUM,
  HEALTH_HIGH,
  HEALTH_VERY_HIGH,
  HOSTILITY_LOW,
  HOSTILITY_MEDIUM,
  HOSTILITY_HIGH,
  DEFAULT_POTION_DURATION,
  Actor,
  Item,
  Player,
  Enemy,
  Zombie,
  Vampire,
  Ghost,
  Ogre,
  Snake,
  Mimic,
};
