import InputHandler from "./inputHandler.js";
import {
  Player,
  Item,
  Zombie,
  Vampire,
  Ghost,
  Ogre,
  Snake,
  Mimic,
} from "../domain/domain_1.js";
import {
  Game,
  Room,
  Corridor,
  Level,
  spawnRandomItem,
} from "../domain/domain_2.js";
import {
  createInitialGameState,
  createStatisticsEntry,
  createLeaderboardEntry,
} from "../datalayer/initialData.js";

class GameController {
  constructor(view, dataLayer) {
    this._view = view;
    this._dataLayer = dataLayer;
    this._input = new InputHandler(view.getScreen());
    this._screen = view.getScreen();

    this._input.on("keypress", (key) => {
      this.handleKeyPress(key);
    });

    this._gameState = "title";
    this._game = null;
    this._waitingForItemSelection = false;
    this._closeItemMenu = null;
    this._pendingAction = null;
    this._currentMenuType = null;
    this._lastAttackedEnemy = null;
    this._skipNextEnemyTurn = false;
    this._view.showTitleScreen();
  }

  async handleKeyPress(key) {
    if (this._waitingForItemSelection) {
      this.handleItemSelection(key);
      return;
    }

    switch (this._gameState) {
      case "title":
        this.handleTitleState(key);
        break;
      case "menu":
        await this.handleMenuState(key);
        break;
      case "game":
        this.handleGameState(key);
        break;
      case "statistics":
        this.handleStatisticsState(key);
        break;
      case "leaderboard":
        this.handleLeaderboardState(key);
        break;
    }
  }

  handleLeaderboardState(key) {
    if (key == "enter" || key == "escape") {
      this.setState("menu");
      this._view.showMainMenu();
    }
  }

  handleTitleState(key) {
    if (key == "enter") {
      this.setState("menu");
      this._view.showMainMenu();
    }
  }

  async handleMenuState(key) {
    if (key == "up") {
      this._view.moveMenuSelection("up");
    } else if (key == "down") {
      this._view.moveMenuSelection("down");
    } else if (key == "enter") {
      const selectedItem = this._view.getSelectedMenuItem();

      if (selectedItem == "New Game") {
        await this.startNewGame();
      } else if (selectedItem == "Continue") {
        await this.continueGame();
      } else if (selectedItem == "Statistics") {
        this.showStatistics();
      } else if (selectedItem == "Leaderboard") {
        await this.showLeaderboard();
      } else if (selectedItem == "Exit") {
        process.exit(0);
      }
    }
  }

  async showLeaderboard() {
    try {
      const leaderboard = await this._dataLayer.loadLeaderboard();
      this._view.showLeaderboard(leaderboard);
      this.setState("leaderboard");
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      this._view.addMessage("Failed to load leaderboard!");
      this.setState("menu");
      this._view.showMainMenu();
    }
  }

  handleStatisticsState(key) {
    if (key == "enter" || key == "escape") {
      this.setState("menu");
      this._view.showMainMenu();
    }
  }

  handleGameState(key) {
    if (!this._game || this._game.isGameOver) return;

    if (key == "toggle3d") {
      this._view.toggleRenderMode();
      this._view.addMessage(
        this._view.is3D()
          ? "3D mode enabled (Tab to toggle)"
          : "2D mode enabled (Tab to toggle)",
      );
      this._view.updateGame(this._game.currentLevel, this._game.player);
      return;
    }

    switch (key) {
      case "up":
        if (this._view.is3D()) {
          this.movePlayerByFacing(1);
        } else {
          this.movePlayer(0, -1);
        }
        break;
      case "down":
        if (this._view.is3D()) {
          this.movePlayerByFacing(-1);
        } else {
          this.movePlayer(0, 1);
        }
        break;
      case "left":
        if (this._view.is3D()) {
          this.rotatePlayer(Math.PI / 2);
        } else {
          this.movePlayer(-1, 0);
        }
        break;
      case "right":
        if (this._view.is3D()) {
          this.rotatePlayer(-Math.PI / 2);
        } else {
          this.movePlayer(1, 0);
        }
        break;
      case "weapon":
        this.showWeaponSelection();
        break;
      case "eat":
        this.showFoodSelection();
        break;
      case "potion":
        this.showPotionSelection();
        break;
      case "scroll":
        this.showScrollSelection();
        break;
      case "escape":
        this.closeItemMenu();
        this.setState("menu");
        this._view.showMainMenu();
        break;
      case "menu":
        this.closeItemMenu();
        this.setState("menu");
        this._view.showMainMenu();
        break;
    }
  }

  closeItemMenu() {
    if (this._closeItemMenu) {
      this._closeItemMenu();
      this._closeItemMenu = null;
    }
    this._waitingForItemSelection = false;
    this._pendingAction = null;
    this._currentMenuType = null;
  }

  movePlayer(dx, dy) {
    const oldX = this._game.player.x;
    const oldY = this._game.player.y;

    const newX = this._game.player.x + dx;
    const newY = this._game.player.y + dy;

    if (this._game.currentLevel.isDoorCell(newX, newY)) {
      const doorColor = this._game.currentLevel.getDoorColor(newX, newY);
      if (doorColor && doorColor != "white") {
        const hasKey = this._game.player.hasKey(doorColor);
        if (!hasKey) {
          this._view.addMessage(
            `You need a ${doorColor} key to open this door!`,
          );
          return;
        }
      }
    }

    const result = this._game.movePlayer(dx, dy);

    if (result == false || (result && result.success == false)) return;

    this._game.player.updateEffects();

    if (result && result.action == "attack") {
      this.processPlayerAttack(result.target);
    } else if (result && result.action == "pickup") {
      this._view.addMessage(`You picked up ${result.target.subtype}`);
    } else if (result && result.action == "exit") {
      this.nextLevel();
      return;
    }

    if (oldX != this._game.player.x || oldY != this._game.player.y) {
      this._game.currentLevel.exploreCurrentPosition(this._game.player);
      this._saveGame().catch(console.error);
    }

    this._view.setDifficulty(this._game.difficulty);
    this._view.updateGame(this._game.currentLevel, this._game.player);

    if (this._game && !this._game.isGameOver) this.enemyTurn();
  }

  movePlayerByFacing(direction) {
    const facing = this._game.player.getFacingVector();
    const dx = facing.dx * direction;
    const dy = facing.dy * direction;

    if (dx == 0 && dy == 0) return;

    this.movePlayer(dx, dy);
  }

  rotatePlayer(deltaAngle) {
    this._game.player.rotate(deltaAngle);
    this._view.updateGame(this._game.currentLevel, this._game.player);
    if (this._game && !this._game.isGameOver) this.enemyTurn();
  }

  processPlayerAttack(enemy) {
    const attackResult = this._game.player.attack(enemy);

    if (attackResult.hit) {
      this._view.addMessage(
        `You hit ${enemy.constructor.name} for ${attackResult.damage} damage!`,
      );
      this._game.stats.hitsDealt++;

      if (enemy.takeDamage(attackResult.damage)) {
        this._view.addMessage(`You defeated ${enemy.constructor.name}!`);
        this._game.stats.enemiesKilled++;
        const goldEarned = Math.floor(Math.random() * 50) + 10;
        this._game.stats.gold += goldEarned;
        this._game.player.gold += goldEarned;
        this.removeEnemyFromLevel(enemy);
        this._lastAttackedEnemy = null;
        return;
      }
    } else {
      this._view.addMessage(`You miss ${enemy.constructor.name}!`);
    }

    if (enemy.health > 0) this._lastAttackedEnemy = enemy;
    else this._lastAttackedEnemy = null;
  }

  processEnemyAttack(enemy) {
    const enemyAttack = enemy.attack(this._game.player);
    if (enemyAttack.hit) {
      const playerDead = this._game.player.takeDamage(enemyAttack.damage);
      this._view.addMessage(
        `${enemy.constructor.name} hits you for ${enemyAttack.damage} damage!`,
      );
      this._game.stats.hitsTaken++;

      if (enemyAttack.difficulty && enemyAttack.difficulty > 0) {
        this._game.adjustDifficulty(-enemyAttack.difficulty);
        this._view.setDifficulty(this._game.difficulty);
      }

      if (playerDead) this.endGame(false);
    } else {
      this._view.addMessage(`${enemy.constructor.name} misses you!`);
    }
  }

  enemyTurn() {
    const attackedEnemies = new Set();

    if (this._game.currentLevel.currentCorridorIndex != null) {
      const currentCorridorIndex = this._game.currentLevel.currentCorridorIndex;
      const corridor = this._game.currentLevel.corridors[currentCorridorIndex];

      for (const room of this._game.currentLevel.rooms) {
        for (const door of room.doors) {
          for (const cell of corridor.cells) {
            const adjacentCells = [
              { x: cell.x + 1, y: cell.y },
              { x: cell.x - 1, y: cell.y },
              { x: cell.x, y: cell.y + 1 },
              { x: cell.x, y: cell.y - 1 },
            ];

            for (const adj of adjacentCells) {
              if (door.x == adj.x && door.y == adj.y) {
                this._game.currentLevel.markDoorAsSeen(door.x, door.y);
                break;
              }
            }
          }
        }
      }
    }

    if (this._lastAttackedEnemy && this._lastAttackedEnemy.health > 0) {
      let enemyExists = false;
      for (const room of this._game.currentLevel.rooms) {
        if (room.enemies.includes(this._lastAttackedEnemy)) {
          enemyExists = true;
          break;
        }
      }

      if (enemyExists && this._lastAttackedEnemy.health > 0) {
        const isWalkable = this._game.currentLevel.isWalkable(
          this._lastAttackedEnemy.x,
          this._lastAttackedEnemy.y,
        );

        const playerInSameRoom = this._lastAttackedEnemy.isPlayerInSameRoom(
          this._game.player,
        );

        const distance =
          Math.abs(this._lastAttackedEnemy.x - this._game.player.x) +
          Math.abs(this._lastAttackedEnemy.y - this._game.player.y);

        if (isWalkable && playerInSameRoom && distance == 1) {
          this.processEnemyAttack(this._lastAttackedEnemy);

          attackedEnemies.add(this._lastAttackedEnemy);
        }
      }
      this._lastAttackedEnemy = null;
    }

    for (const room of this._game.currentLevel.rooms) {
      const enemies = [...room.enemies];
      for (const enemy of enemies) {
        if (attackedEnemies.has(enemy)) {
          continue;
        }

        if (enemy.health > 0 && room.enemies.includes(enemy)) {
          const isWalkable = this._game.currentLevel.isWalkable(
            enemy.x,
            enemy.y,
          );

          const playerInSameRoom = enemy.isPlayerInSameRoom(this._game.player);

          const distance =
            Math.abs(enemy.x - this._game.player.x) +
            Math.abs(enemy.y - this._game.player.y);

          if (isWalkable && playerInSameRoom && distance == 1) {
            this.processEnemyAttack(enemy);
            attackedEnemies.add(enemy);
          } else {
            if (isWalkable) {
              enemy.act(this._game.player, this._game.currentLevel);
            }
          }
        }
      }
    }
    this._view.setDifficulty(this._game.difficulty);
    this._view.updateGame(this._game.currentLevel, this._game.player);
  }

  removeEnemyFromLevel(enemy) {
    if (enemy.health > 0) return;

    for (const room of this._game.currentLevel.rooms) {
      const index = room.enemies.indexOf(enemy);
      if (index != -1) {
        room.enemies.splice(index, 1);
        if (Math.random() < 0.3) {
          const item = spawnRandomItem(enemy.x, enemy.y);
          room.items.push(item);
          this._view.addMessage(
            `${enemy.constructor.name} dropped ${item.subtype}!`,
          );
        }
        break;
      }
    }
  }

  removeItemFromLevel(item) {
    for (const room of this._game.currentLevel.rooms) {
      const index = room.items.indexOf(item);
      if (index != -1) {
        room.items.splice(index, 1);
        break;
      }
    }
  }

  showWeaponSelection() {
    if (!this._game.player.weapons || this._game.player.weapons.length == 0) {
      this._view.addMessage("You have no weapons!");
      return;
    }

    if (this._waitingForItemSelection && this._currentMenuType == "weapon") {
      this.closeItemMenu();
      return;
    }

    this._waitingForItemSelection = true;
    this._pendingAction = "weapon";
    this._currentMenuType = "weapon";
    this._closeItemMenu = this._view.showItemSelectionMenu(
      this._game.player.weapons,
      "weapon",
      null,
    );
  }

  showFoodSelection() {
    if (!this._game.player.food || this._game.player.food.length == 0) {
      this._view.addMessage("You have no food!");
      return;
    }

    if (this._waitingForItemSelection && this._currentMenuType == "food") {
      this.closeItemMenu();
      return;
    }

    this._waitingForItemSelection = true;
    this._pendingAction = "food";
    this._currentMenuType = "food";
    this._closeItemMenu = this._view.showItemSelectionMenu(
      this._game.player.food,
      "food",
      null,
    );
  }

  showPotionSelection() {
    if (!this._game.player.potions || this._game.player.potions.length == 0) {
      this._view.addMessage("You have no potions!");
      return;
    }

    if (this._waitingForItemSelection && this._currentMenuType == "potion") {
      this.closeItemMenu();
      return;
    }

    this._waitingForItemSelection = true;
    this._pendingAction = "potion";
    this._currentMenuType = "potion";
    this._closeItemMenu = this._view.showItemSelectionMenu(
      this._game.player.potions,
      "potion",
      null,
    );
  }

  showScrollSelection() {
    if (!this._game.player.scrolls || this._game.player.scrolls.length == 0) {
      this._view.addMessage("You have no scrolls!");
      return;
    }

    if (this._waitingForItemSelection && this._currentMenuType == "scroll") {
      this.closeItemMenu();
      return;
    }

    this._waitingForItemSelection = true;
    this._pendingAction = "scroll";
    this._currentMenuType = "scroll";
    this._closeItemMenu = this._view.showItemSelectionMenu(
      this._game.player.scrolls,
      "scroll",
      null,
    );
  }

  handleItemSelection(key) {
    if (key == "escape") {
      this.closeItemMenu();
      return;
    }

    const num = parseInt(key);

    if (this._pendingAction == "weapon" && key == "0") {
      this._game.player.weapon = null;
      this._view.addMessage("Weapon unequipped");
      this.closeItemMenu();
      this._view.updateGame(this._game.currentLevel, this._game.player);
      return;
    }

    if (!isNaN(num) && num >= 1 && num <= 9) {
      const index = num - 1;
      let item = null;

      switch (this._pendingAction) {
        case "weapon":
          if (index < this._game.player.weapons.length) {
            item = this._game.player.weapons[index];
            this._game.player.useItem(item);
            this._view.addMessage(`Equipped ${item.subtype}`);
            this.closeItemMenu();
          }
          break;
        case "food":
          if (index < this._game.player.food.length) {
            item = this._game.player.food[index];
            this._game.player.useItem(item);
            this._game.player.removeItem("food", index);
            this._view.addMessage(
              `Ate ${item.subtype}, restored ${item.health} health`,
            );
            this._game.stats.foodEaten++;
            this.closeItemMenu();
          }
          break;
        case "potion":
          if (index < this._game.player.potions.length) {
            item = this._game.player.potions[index];
            this._game.player.useItem(item);
            this._game.player.removeItem("potion", index);
            this._view.addMessage(`Drank ${item.subtype}`);
            this._game.stats.potionsDrunk++;
            this.closeItemMenu();
          }
          break;
        case "scroll":
          if (index < this._game.player.scrolls.length) {
            item = this._game.player.scrolls[index];
            const difficultyChange = this._game.player.useItem(item);
            this._game.player.removeItem("scroll", index);
            this._view.addMessage(`Read ${item.subtype}`);
            this._game.stats.scrollsRead++;

            if (difficultyChange > 0) {
              const oldDifficulty = this._game.difficulty;
              this._game.difficulty = Math.min(
                200,
                this._game.difficulty + difficultyChange,
              );

              this._view.setDifficulty(this._game.difficulty);
            }

            this.closeItemMenu();
          }
          break;
      }

      if (item) {
        this._view.updateGame(this._game.currentLevel, this._game.player);
      }
    }
  }

  async nextLevel() {
    if (this._game.currentLevelIndex + 1 >= 21) {
      this._view.addMessage("Congratulations! You have completed all levels!");
      await this.endGame(true);
      return;
    }

    this._game.player.clearKeys();
    this._game.currentLevelIndex++;

    if (this._game.stats.maxLevel < this._game.currentLevelIndex + 1) {
      this._game.stats.maxLevel = this._game.currentLevelIndex + 1;
    }

    this._game.difficulty = Math.min(this._game.difficulty + 10, 200);

    const nextLevel = this._game.Level.generate(
      this._game.currentLevelIndex,
      this._game.difficulty,
    );
    this._game.levels.push(nextLevel);
    this._game.currentLevel = nextLevel;

    if (nextLevel.startRoom) {
      nextLevel.placePlayer(this._game.player, nextLevel.startRoom);
    }

    nextLevel.exploreCurrentPosition(this._game.player);
    this._lastAttackedEnemy = null;
    if (this._waitingForItemSelection) this.closeItemMenu();
    await this._saveGame();
    this._view.setCurrentLevelIndex(this._game.currentLevelIndex);
    this._view.setDifficulty(this._game.difficulty);
    this._view.showGameScreen(this._game.currentLevel, this._game.player);
  }

  async _saveGame() {
    try {
      const gameState = createInitialGameState(this._game);
      await this._dataLayer.saveGame(gameState);
    } catch (error) {
      console.error("Error saving game:", error);
    }
  }

  async startNewGame() {
    const player = new Player(0, 0);
    this._game = new Game(player);
    this._game.startNewGame();
    await this._saveGame();
    this._view.setCurrentLevelIndex(0);
    this._view.setDifficulty(this._game.difficulty);
    this.setState("game");
    this._view.showGameScreen(this._game.currentLevel, this._game.player);
    this._view.addMessage("Game started! Use WASD to move, Tab to toggle 3D");
  }

  async continueGame() {
    try {
      const savedState = await this._dataLayer.loadGame();

      if (
        savedState &&
        Object.keys(savedState).length > 0 &&
        savedState.currentLevelIndex != undefined
      ) {
        this._view.addMessage("Loading saved game...");

        const player = new Player(0, 0);
        this._game = new Game(player);

        this._game.currentLevelIndex = savedState.currentLevelIndex;
        this._game.isGameOver = savedState.isGameOver;
        this._game.difficulty = savedState.difficulty;

        if (savedState.player) {
          this._game.player.x = savedState.player.x;
          this._game.player.y = savedState.player.y;
          this._game.player.health = savedState.player.health;
          this._game.player.maxHealth = savedState.player.maxHealth;
          this._game.player.strength = savedState.player.strength;
          this._game.player.agility = savedState.player.agility;
          this._game.player.gold = savedState.player.gold;

          if (typeof savedState.player.viewAngle == "number") {
            this._game.player.viewAngle = savedState.player.viewAngle;
          }
          if (typeof savedState.player.fov == "number") {
            this._game.player.fov = savedState.player.fov;
          }
          if (typeof savedState.player.viewDistance == "number") {
            this._game.player.viewDistance = savedState.player.viewDistance;
          }

          if (savedState.player.weapon) {
            this._game.player.weapon = new Item(
              0,
              0,
              "weapon",
              savedState.player.weapon.subtype,
            );
          }

          if (savedState.player.food && Array.isArray(savedState.player.food)) {
            this._game.player.food = savedState.player.food.map(
              (itemData) => new Item(0, 0, "food", itemData.subtype),
            );
          }

          if (
            savedState.player.potions &&
            Array.isArray(savedState.player.potions)
          ) {
            this._game.player.potions = savedState.player.potions.map(
              (itemData) => new Item(0, 0, "potion", itemData.subtype),
            );
          }

          if (
            savedState.player.scrolls &&
            Array.isArray(savedState.player.scrolls)
          ) {
            this._game.player.scrolls = savedState.player.scrolls.map(
              (itemData) => new Item(0, 0, "scroll", itemData.subtype),
            );
          }

          if (
            savedState.player.weapons &&
            Array.isArray(savedState.player.weapons)
          ) {
            this._game.player.weapons = savedState.player.weapons.map(
              (itemData) => new Item(0, 0, "weapon", itemData.subtype),
            );
          }
        }

        if (savedState.stats) {
          Object.assign(this._game.stats, savedState.stats);
        }

        let level;
        if (savedState.currentLevel) {
          level = this._restoreLevel(savedState.currentLevel);
        } else {
          level = this._game.Level.generate(
            this._game.currentLevelIndex,
            this._game.difficulty,
          );
        }

        this._game.levels = [level];
        this._game.currentLevel = level;

        if (
          savedState.player &&
          level.isWalkable(savedState.player.x, savedState.player.y) &&
          !level.getActorAt(savedState.player.x, savedState.player.y)
        ) {
          this._game.player.x = savedState.player.x;
          this._game.player.y = savedState.player.y;
        } else {
          if (level.startRoom) {
            level.placePlayer(this._game.player, level.startRoom);
          }
        }

        if (savedState.player.keys && Array.isArray(savedState.player.keys)) {
          this._game.player.keys = savedState.player.keys.map(
            (keyData) => new Item(0, 0, "key", keyData.subtype),
          );
        }

        level.exploreCurrentPosition(this._game.player);

        this._view.setCurrentLevelIndex(this._game.currentLevelIndex);
        this._view.setDifficulty(this._game.difficulty);
        this.setState("game");
        this._view.showGameScreen(this._game.currentLevel, this._game.player);
        this._view.addMessage(
          `Game loaded! Level ${this._game.currentLevelIndex + 1}`,
        );
      } else {
        this._view.addMessage("No saved game found. Starting new game!");
        await this.startNewGame();
      }
    } catch (error) {
      console.error("Error loading game:", error);
      this._view.addMessage("Error loading saved game. Starting new game!");
    }
  }

  _restoreLevel(savedLevel) {
    const rooms = savedLevel.rooms.map((roomData) => {
      const room = new Room(
        roomData.x,
        roomData.y,
        roomData.width,
        roomData.height,
      );
      room.doors = roomData.doors || [];
      room.isStart = roomData.isStart || false;
      room.isEnd = roomData.isEnd || false;
      room.isExit = roomData.isExit || false;
      room.exitX = roomData.exitX;
      room.exitY = roomData.exitY;

      if (roomData.enemies) {
        room.enemies = roomData.enemies.map((enemyData) => {
          let enemy;
          switch (enemyData.type) {
            case "Zombie":
              enemy = new Zombie(enemyData.x, enemyData.y);
              break;
            case "Vampire":
              enemy = new Vampire(enemyData.x, enemyData.y);
              if (enemyData.firstAttack != undefined)
                enemy.firstAttack = enemyData.firstAttack;
              if (enemyData.isDead != undefined)
                enemy.isDead = enemyData.isDead;
              break;
            case "Ghost":
              enemy = new Ghost(enemyData.x, enemyData.y);
              if (enemyData.invisible != undefined)
                enemy.invisible = enemyData.invisible;
              break;
            case "Ogre":
              enemy = new Ogre(enemyData.x, enemyData.y);
              if (enemyData.resting != undefined)
                enemy.resting = enemyData.resting;
              break;
            case "Snake":
              enemy = new Snake(enemyData.x, enemyData.y);
              if (enemyData.direction) {
                enemy.direction = enemyData.direction;
              }
              break;
            case "Mimic":
              enemy = new Mimic(enemyData.x, enemyData.y);
              break;
            default:
              enemy = new Zombie(enemyData.x, enemyData.y);
          }
          enemy.health = enemyData.health;
          enemy.strength = enemyData.strength;
          enemy.agility = enemyData.agility;
          enemy.room = room;
          return enemy;
        });
      }

      if (roomData.items) {
        room.items = roomData.items.map((itemData) => {
          const item = new Item(
            itemData.x,
            itemData.y,
            itemData.type,
            itemData.subtype,
          );
          item.strength = itemData.strength || 0;
          item.agility = itemData.agility || 0;
          item.health = itemData.health || 0;
          item.maxHealth = itemData.maxHealth || 0;
          return item;
        });
      }

      return room;
    });

    const corridors = savedLevel.corridors.map(
      (corridorData) => new Corridor(corridorData.cells),
    );

    const level = new Level(savedLevel.index, rooms, corridors);

    if (savedLevel.exploredRooms) {
      level.exploredRooms = new Set(savedLevel.exploredRooms);
    }
    if (savedLevel.exploredCorridors) {
      level.exploredCorridors = new Set(savedLevel.exploredCorridors);
    }
    if (savedLevel.seenDoors) {
      level.seenDoors = new Set(savedLevel.seenDoors);
    }

    return level;
  }

  showStatistics() {
    if (this._game) {
      this._view.showStatistics(this._game.stats);
      this.setState("statistics");
    } else {
      const emptyStats = {
        maxLevel: 1,
        gold: 0,
        enemiesKilled: 0,
        foodEaten: 0,
        potionsDrunk: 0,
        scrollsRead: 0,
        hitsDealt: 0,
        hitsTaken: 0,
        steps: 0,
      };
      this._view.showStatistics(emptyStats);
      this.setState("statistics");
    }
  }

  async endGame(victory) {
    this._game.isGameOver = true;

    try {
      const statsEntry = createStatisticsEntry(this._game, victory);
      await this._dataLayer.addToStatistics(statsEntry);

      const leaderboardEntry = createLeaderboardEntry(this._game);

      const currentLeaderboard = await this._dataLayer.loadLeaderboard();
      currentLeaderboard.push(leaderboardEntry);
      await this._dataLayer.saveLeaderboard(currentLeaderboard);

      await this._dataLayer.deleteSave();

      this._view.addMessage("Game statistics saved!");
    } catch (error) {
      console.error("Error saving statistics:", error);
      this._view.addMessage("Failed to save game statistics!");
    }

    if (victory) {
      this._view.addMessage("Congratulations! You beat the game!");
    } else {
      this._view.addMessage("You died! Game Over!");
    }

    this.setState("menu");
    setTimeout(() => {
      this._view.showMainMenu();
    }, 2000);
  }

  gameLoop() {
    this._interval = setInterval(() => {
      this._screen.render();
    }, 33);
  }

  startGame() {
    this.gameLoop();
  }

  getState() {
    return this._gameState;
  }

  setState(state) {
    this._gameState = state;
  }
}

export default GameController;
