import blessed from "blessed";

class View {
  constructor() {
    this._screen = blessed.screen({ smartCSR: true, title: "Rogue" });
    this._currentScreen = null;
    this._menuItems = [];
    this._selectedIndex = 0;

    this._gameBox = null;
    this._statusBox = null;
    this._inventoryBox = null;
    this._messageBox = null;

    this._mapWidth = 50;
    this._mapHeight = 50;
    this._mapCells = [];
    this._renderMode = "2d";
    this._miniMapBox = null;
    this._lastLevel = null;
    this._lastPlayer = null;

    this.colors = ["red", "yellow", "green", "cyan", "magenta"];
    this.colorIndex = 0;

    this._setupScreen();
  }

  _setupScreen() {
    this._screen.on("resize", () => {
      this._screen.render();
    });
  }

  showTitleScreen() {
    this.clearScreen();

    const titleBox = blessed.box({
      parent: this._screen,
      top: "center",
      left: "center",
      width: 60,
      height: 15,
      content:
        "{center}{bold}" +
        "╔══════════════════════════════════════════════════╗\n" +
        "║                                                  ║\n" +
        "║     ██████╗  ██████╗  ██████╗ ██╗   ██╗██████║   ║\n" +
        "║     ██╔══██╗██╔═══██╗██╔════╝ ██║   ██║██╔═══╗   ║\n" +
        "║     ██████╔╝██║   ██║██║  ███╗██║   ██║██████║   ║\n" +
        "║     ██╔══██╗██║   ██║██║   ██║██║   ██║██╔═══╗   ║\n" +
        "║     ██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝██████║   ║\n" +
        "║     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝   ║\n" +
        "║                                                  ║\n" +
        "║            Press ENTER to continue               ║\n" +
        "╚══════════════════════════════════════════════════╝{/bold}{/center}",
      tags: true,
      style: {
        fg: "yellow",
        bg: "black",
      },
    });

    this._currentScreen = "title";
    this._screen.render();
  }

  showMainMenu() {
    this.clearScreen();
    this._menuItems = [
      "New Game",
      "Continue",
      "Statistics",
      "Leaderboard",
      "Exit",
    ];
    this._selectedIndex = 0;

    const menuBox = blessed.box({
      parent: this._screen,
      top: "center",
      left: "center",
      width: 40,
      height: 12,
      tags: true,
      style: {
        fg: "cyan",
        bg: "black",
      },
    });

    this._updateMenuDisplay(menuBox);
    this._currentMenuBox = menuBox;
    this._currentScreen = "menu";
    this._screen.render();
  }

  _updateMenuDisplay(menuBox) {
    let menuContent =
      "{center}{bold}═══════════════════════════{/bold}{/center}\n";
    menuContent +=
      "{center}{bold}        ROGUE              {/bold}{/center}\n";
    menuContent +=
      "{center}{bold}═══════════════════════════{/bold}{/center}\n\n";

    this._menuItems.forEach((item, index) => {
      if (index == this._selectedIndex) {
        menuContent +=
          "{center}{bold}{yellow-fg}▶ " +
          item +
          " ◀{/yellow-fg}{/bold}{/center}\n";
      } else {
        menuContent += "{center}  " + item + "  {/center}\n";
      }
    });

    menuContent +=
      "\n{center}{bold}═══════════════════════════{/bold}{/center}";

    menuBox.setContent(menuContent);
    this._screen.render();
  }

  moveMenuSelection(direction) {
    if (direction == "up") {
      this._selectedIndex =
        (this._selectedIndex - 1 + this._menuItems.length) %
        this._menuItems.length;
    } else if (direction == "down") {
      this._selectedIndex = (this._selectedIndex + 1) % this._menuItems.length;
    }
    this._updateMenuDisplay(this._currentMenuBox);
  }

  getSelectedMenuItem() {
    return this._menuItems[this._selectedIndex];
  }

  showGameScreen(level, player) {
    this.clearScreen();

    const screenHeight = this._screen.height;
    const screenWidth = this._screen.width;

    const messagesHeight = 10;

    this._mapHeight = screenHeight - messagesHeight;
    this._mapWidth = Math.floor(screenWidth * 0.7);

    const panelWidth = screenWidth - this._mapWidth;

    this._gameBox = blessed.box({
      parent: this._screen,
      top: 0,
      left: 0,
      width: this._mapWidth,
      height: this._mapHeight,
      tags: true,
      style: {
        fg: "white",
        bg: "black",
      },
    });

    this._statusBox = blessed.box({
      parent: this._screen,
      top: 0,
      left: this._mapWidth,
      width: panelWidth,
      height: Math.floor(this._mapHeight * 0.5),
      tags: true,
      style: {
        fg: "green",
        bg: "black",
        border: {
          fg: "cyan",
        },
      },
      border: {
        type: "line",
      },
      label: " Status ",
    });

    this._inventoryBox = blessed.box({
      parent: this._screen,
      top: Math.floor(this._mapHeight * 0.5),
      left: this._mapWidth,
      width: panelWidth,
      height: Math.floor(this._mapHeight * 0.5),
      tags: true,
      style: {
        fg: "yellow",
        bg: "black",
        border: {
          fg: "cyan",
        },
      },
      border: {
        type: "line",
      },
      label: " Inventory ",
    });

    this._messageBox = blessed.box({
      parent: this._screen,
      top: this._mapHeight,
      left: 0,
      width: screenWidth,
      height: messagesHeight,
      tags: true,
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "cyan",
        },
      },
      border: {
        type: "line",
      },
      label: " Messages ",
    });

    this._updateGameDisplay(level, player);
    this._currentScreen = "game";
    this._screen.render();
  }

  _updateGameDisplay(level, player) {
    this._lastLevel = level || this._lastLevel;
    this._lastPlayer = player || this._lastPlayer;
    if (this._renderMode == "3d") {
      this._update3DGameDisplay(level, player);
    } else {
      this._update2DGameDisplay(level, player);
    }
  }

  _update2DGameDisplay(level, player) {
    if (!this._gameBox || !level) return;

    let mapContent = "";

    for (let y = 0; y < this._mapHeight; y++) {
      for (let x = 0; x < this._mapWidth; x++) {
        if (player && x == player.x && y == player.y) {
          mapContent += "{yellow-fg}@";
        } else {
          const visibility = level.isVisible(x, y, player);

          if (visibility.visible) {
            if (level.isExitCell(x, y)) {
              mapContent += "{yellow-fg}E";
            } else if (level.isDoorCell(x, y)) {
              const doorColor = level.getDoorColor(x, y);
              if (doorColor && doorColor != "white") {
                mapContent += `{${doorColor}-fg}X`;
              } else {
                mapContent += "{white-fg}X";
              }
            } else if (visibility.showContent) {
              const actor = level.getActorAt(x, y);
              if (actor) {
                mapContent += this._getActorColor(actor) + actor.char;
              } else if (level.isWalkable(x, y)) {
                mapContent += "{gray-fg}.";
              } else {
                mapContent += "{gray-fg}#";
              }
            } else {
              if (level.isWalkable(x, y)) {
                mapContent += "{gray-fg}.";
              } else {
                mapContent += "{gray-fg}#";
              }
            }
          } else {
            mapContent += "{gray-fg}#";
          }
        }
        mapContent += "{/}";
      }
      mapContent += "\n";
    }

    this._gameBox.setContent(mapContent);
    this._updateSidePanels(player);
    this._screen.render();
  }

  _update3DGameDisplay(level, player) {
    if (!this._gameBox || !level || !player) return;

    const scene = this._render3DScene(level, player);
    this._gameBox.setContent(scene);

    this._ensureMiniMapBox();
    this._renderMiniMap(level, player);

    this._updateSidePanels(player);
    this._screen.render();
  }

  _updateSidePanels(player) {
    if (!player) return;
    const difficulty =
      this._currentDifficulty != undefined ? this._currentDifficulty : 100;

    let statusContent =
      `Health: ${player.health}/${player.maxHealth}\n` +
      `Strength: ${player.weapon ? player.weapon.strength + player.strength : player.strength}\n` +
      `Agility: ${player.agility}\n` +
      `Gold: ${player.gold}\n` +
      `Weapon: ${player.weapon ? player.weapon.subtype : "None"}\n` +
      `Level: ${this._currentLevelIndex + 1}/21\n` +
      `Difficulty: ${Math.floor(difficulty)}`;

    if (player.hasActiveEffects && player.hasActiveEffects()) {
      const effects = player.getActiveEffects();
      statusContent += `\n\nActive Effects:`;
      effects.forEach((effect) => {
        const effectName =
          effect.type == "strength"
            ? "Strength"
            : effect.type == "agility"
              ? "Agility"
              : "Max Health";
        statusContent += `\n+${effect.amount} ${effectName} (${effect.remainingTurns} turns)`;
      });
    }

    this._statusBox.setContent(statusContent);

    let inventoryContent = "";
    inventoryContent +=
      "J. Food: " + (player.food ? player.food.length : 0) + "\n";
    inventoryContent +=
      "K. Potions: " + (player.potions ? player.potions.length : 0) + "\n";
    inventoryContent +=
      "E. Scrolls: " + (player.scrolls ? player.scrolls.length : 0) + "\n";
    inventoryContent +=
      "H. Weapons: " + (player.weapons ? player.weapons.length : 0) + "\n";

    if (player.keys && player.keys.length > 0) {
      inventoryContent += "\n{white-fg}Keys:{/}";
      player.keys.forEach((key) => {
        const color = key.color || "white";
        inventoryContent += ` {${color}-fg}H{/}`;
      });
    }

    this._inventoryBox.setContent(inventoryContent);
  }

  _ensureMiniMapBox() {
    if (this._miniMapBox) return;

    const width = Math.min(24, this._mapWidth);
    const height = Math.min(12, this._mapHeight);

    this._miniMapBox = blessed.box({
      parent: this._screen,
      top: 0,
      left: 0,
      width,
      height,
      tags: true,
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "cyan",
        },
      },
      border: {
        type: "line",
      },
      label: " Map ",
    });
  }

  _detachMiniMapBox() {
    if (this._miniMapBox) {
      this._miniMapBox.detach();
      this._miniMapBox = null;
    }
  }

  _renderMiniMap(level, player) {
    if (!this._miniMapBox) return;

    const width = this._miniMapBox.width - 2;
    const height = this._miniMapBox.height - 2;
    const bounds = this._getLevelBounds(level);

    const startX = Math.floor(player.x - width / 2);
    const startY = Math.floor(player.y - height / 2);

    let content = "";

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const mapX = startX + x;
        const mapY = startY + y;

        if (mapX == player.x && mapY == player.y) {
          content += "{yellow-fg}@{/}";
          continue;
        }

        if (
          mapX < bounds.minX ||
          mapX > bounds.maxX ||
          mapY < bounds.minY ||
          mapY > bounds.maxY
        ) {
          content += " ";
          continue;
        }

        const visibility = level.isVisible(mapX, mapY, player);
        if (!visibility.visible) {
          content += " ";
          continue;
        }

        if (visibility.showContent) {
          const actor = level.getActorAt(mapX, mapY);
          if (actor) {
            content += `${this._getActorColor(actor)}${actor.char}{/}`;
            continue;
          }
        }

        if (level.isExitCell(mapX, mapY)) {
          content += "{yellow-fg}E{/}";
        } else if (level.isDoorCell(mapX, mapY)) {
          const doorColor = level.getDoorColor(mapX, mapY);
          if (doorColor && doorColor != "white") {
            content += `{${doorColor}-fg}X{/}`;
          } else {
            content += "{white-fg}X{/}";
          }
        } else if (level.isWalkable(mapX, mapY)) {
          content += "{gray-fg}.{/}";
        } else {
          content += "{gray-fg}#{/}";
        }
      }
      content += "\n";
    }

    this._miniMapBox.setContent(content);
  }

  _render3DScene(level, player) {
    const width = this._mapWidth;
    const height = this._mapHeight;
    const bounds = this._getLevelBounds(level);

    const rows = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => " "),
    );
    const wallDistances = new Array(width);
    const wallTops = new Array(width);
    const wallBottoms = new Array(width);

    for (let x = 0; x < width; x++) {
      const rayAngle =
        player.viewAngle - player.fov / 2 + (x / width) * player.fov;

      const rayResult = this._castRay(level, player, rayAngle, bounds);
      const correctedDistance =
        rayResult.distance * Math.cos(rayAngle - player.viewAngle);

      wallDistances[x] = correctedDistance;

      const wallHeight = Math.floor(
        height / Math.max(correctedDistance, 0.1),
      );
      const ceiling = Math.floor(height / 2 - wallHeight / 2);
      const floor = height - ceiling;
      wallTops[x] = ceiling;
      wallBottoms[x] = floor;

      const wallChar = this._selectWallChar(
        correctedDistance,
        player.viewDistance,
        rayResult.boundary,
      );

      for (let y = 0; y < height; y++) {
        if (y < ceiling) {
          rows[y][x] = " ";
        } else if (y >= ceiling && y <= floor) {
          rows[y][x] = wallChar;
        } else {
          rows[y][x] = this._selectFloorChar(y, height);
        }
      }
    }

    const sprites = this._collectVisibleActors(level, player);
    for (const sprite of sprites) {
      const dx = sprite.x - player.x;
      const dy = sprite.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 0.1) continue;

      const angleToSprite = Math.atan2(dx, dy);
      const delta = this._normalizeAngle(angleToSprite - player.viewAngle);

      if (Math.abs(delta) > player.fov / 2) continue;

      const spriteScreenX = Math.floor(
        ((delta + player.fov / 2) / player.fov) * width,
      );

      const spriteHeight = Math.floor(height / distance);
      const spriteWidth = Math.max(1, Math.floor(spriteHeight / 3));
      const top = Math.floor(height / 2 - spriteHeight / 2);
      const bottom = Math.floor(height / 2 + spriteHeight / 2);

      const startX = Math.floor(spriteScreenX - spriteWidth / 2);
      const endX = Math.floor(spriteScreenX + spriteWidth / 2);

      for (let sx = startX; sx <= endX; sx++) {
        if (sx < 0 || sx >= width) continue;
        if (wallDistances[sx] != null && wallDistances[sx] < distance) continue;

        const drawTop = Math.max(top, 0);
        const drawBottom = Math.min(bottom, height - 1);

        for (let y = drawTop; y <= drawBottom; y++) {
          rows[y][sx] = this._colorizeChar(sprite.char, sprite.color);
        }
      }
    }

    return rows.map((row) => row.join("")).join("\n");
  }

  _castRay(level, player, rayAngle, bounds) {
    const originX = player.x + 0.5;
    const originY = player.y + 0.5;
    let distance = 0;
    let hitWall = false;
    let boundary = false;
    const step = 0.1;

    while (!hitWall && distance < player.viewDistance) {
      distance += step;
      const testX = originX + Math.sin(rayAngle) * distance;
      const testY = originY + Math.cos(rayAngle) * distance;

      const mapX = Math.floor(testX);
      const mapY = Math.floor(testY);

      if (
        mapX < bounds.minX ||
        mapX > bounds.maxX ||
        mapY < bounds.minY ||
        mapY > bounds.maxY
      ) {
        hitWall = true;
        distance = player.viewDistance;
        break;
      }

      if (!level.isWalkable(mapX, mapY)) {
        hitWall = true;
        boundary = this._isBoundaryHit(testX, testY, mapX, mapY);
      }
    }

    return { distance, boundary };
  }

  _isBoundaryHit(testX, testY, mapX, mapY) {
    const blockMidX = mapX + 0.5;
    const blockMidY = mapY + 0.5;
    const dx = testX - blockMidX;
    const dy = testY - blockMidY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance > 0.45;
  }

  _selectWallChar(distance, maxDistance, boundary) {
    if (boundary) return "|";
    const ratio = distance / maxDistance;
    if (ratio < 0.2) return "#";
    if (ratio < 0.4) return "X";
    if (ratio < 0.6) return "x";
    if (ratio < 0.8) return ".";
    return "-";
  }

  _selectFloorChar(y, height) {
    const relative = (y - height / 2) / (height / 2);
    if (relative < 0.25) return ".";
    if (relative < 0.5) return ",";
    if (relative < 0.75) return "-";
    return " ";
  }

  _collectVisibleActors(level, player) {
    const actors = [];
    for (const room of level.rooms) {
      for (const enemy of room.enemies) {
        const visibility = level.isVisible(enemy.x, enemy.y, player);
        if (visibility.visible && visibility.showContent) {
          actors.push(enemy);
        }
      }
      for (const item of room.items) {
        const visibility = level.isVisible(item.x, item.y, player);
        if (visibility.visible && visibility.showContent) {
          actors.push(item);
        }
      }
    }

    actors.sort((a, b) => {
      const da =
        (a.x - player.x) * (a.x - player.x) +
        (a.y - player.y) * (a.y - player.y);
      const db =
        (b.x - player.x) * (b.x - player.x) +
        (b.y - player.y) * (b.y - player.y);
      return db - da;
    });

    return actors;
  }

  _normalizeAngle(angle) {
    const twoPi = Math.PI * 2;
    angle = (angle + Math.PI) % twoPi;
    if (angle < 0) angle += twoPi;
    return angle - Math.PI;
  }

  _colorizeChar(char, color) {
    if (!color || color == "white") return char;
    return `{${color}-fg}${char}{/}`;
  }

  _getLevelBounds(level) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const room of level.rooms) {
      minX = Math.min(minX, room.x);
      minY = Math.min(minY, room.y);
      maxX = Math.max(maxX, room.x + room.width - 1);
      maxY = Math.max(maxY, room.y + room.height - 1);
    }

    for (const corridor of level.corridors) {
      for (const cell of corridor.cells) {
        minX = Math.min(minX, cell.x);
        minY = Math.min(minY, cell.y);
        maxX = Math.max(maxX, cell.x);
        maxY = Math.max(maxY, cell.y);
      }
    }

    if (!isFinite(minX)) {
      minX = 0;
      minY = 0;
      maxX = this._mapWidth - 1;
      maxY = this._mapHeight - 1;
    }

    return { minX, minY, maxX, maxY };
  }

  setDifficulty(difficulty) {
    this._currentDifficulty = difficulty;
  }

  setRenderMode(mode) {
    this._renderMode = mode == "3d" ? "3d" : "2d";
    if (this._renderMode == "3d") {
      this._ensureMiniMapBox();
    } else {
      this._detachMiniMapBox();
    }

    if (this._currentScreen == "game" && this._lastLevel && this._lastPlayer) {
      this._updateGameDisplay(this._lastLevel, this._lastPlayer);
    }
  }

  toggleRenderMode() {
    this.setRenderMode(this._renderMode == "3d" ? "2d" : "3d");
  }

  is3D() {
    return this._renderMode == "3d";
  }

  _getActorColor(actor) {
    if (actor.color == "yellow") return "{yellow-fg}";
    if (actor.color == "green") return "{green-fg}";
    if (actor.color == "red") return "{red-fg}";
    if (actor.color == "blue") return "{blue-fg}";
    return "{white-fg}";
  }

  addMessage(message) {
    if (this._messageBox) {
      const currentContent = this._messageBox.getContent();
      const lines = currentContent.split("\n").slice(-7);
      lines.push(message);
      this._messageBox.setContent(lines.join("\n"));
      this._screen.render();
    }
  }

  showItemSelectionMenu(items, type, callback) {
    const menuBox = blessed.box({
      parent: this._screen,
      top: "center",
      left: "center",
      width: 50,
      height: Math.min(items.length + 4, 15),
      tags: true,
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "yellow",
        },
      },
      border: {
        type: "line",
      },
      label: ` Select ${type} (0-${Math.min(items.length, 9)}) `,
    });

    let content = "\n";
    items.forEach((item, index) => {
      if (index < 9) {
        content += `  ${index + 1}. ${item.subtype}\n`;
      }
    });
    if (type == "weapon") {
      content += `  0. Unequip weapon\n`;
    }

    menuBox.setContent(content);
    this._screen.render();

    return () => {
      menuBox.detach();
      this._screen.render();
    };
  }

  showStatistics(stats) {
    this.clearScreen();

    const statsBox = blessed.box({
      parent: this._screen,
      top: "center",
      left: "center",
      width: 60,
      height: 20,
      tags: true,
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "cyan",
        },
      },
      border: {
        type: "line",
      },
      label: " Statistics ",
    });

    let content = "\n";
    content += `Maximum Level Reached: ${stats.maxLevel || 0}\n`;
    content += `Gold Collected: ${stats.gold || 0}\n`;
    content += `Enemies Killed: ${stats.enemiesKilled || 0}\n`;
    content += `Food Eaten: ${stats.foodEaten || 0}\n`;
    content += `Potions Drunk: ${stats.potionsDrunk || 0}\n`;
    content += `Scrolls Read: ${stats.scrollsRead || 0}\n`;
    content += `Hits Dealt: ${stats.hitsDealt || 0}\n`;
    content += `Hits Taken: ${stats.hitsTaken || 0}\n`;
    content += `Steps Taken: ${stats.steps || 0}\n`;
    content += "\nPress ENTER to return to menu";

    statsBox.setContent(content);
    this._screen.render();

    this._currentStatsBox = statsBox;
    this._currentScreen = "statistics";
  }

  showLeaderboard(leaderboard) {
    this.clearScreen();

    const leaderboardBox = blessed.box({
      parent: this._screen,
      top: "center",
      left: "center",
      width: 52,
      height: Math.min(leaderboard.length + 6, 25),
      tags: true,
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "cyan",
        },
      },
      border: {
        type: "line",
      },
      label: " Leaderboard ",
    });

    let content = "";

    content += "\n";
    content += "{bold}";
    content += " Rank  Level     Gold    Killed        Date\n";
    content += "─────────────────────────────────────────────────\n";
    content += "{/bold}";

    const sorted = [...leaderboard]
      .sort((a, b) => {
        if (a.achievedLevel != b.achievedLevel) {
          return b.achievedLevel - a.achievedLevel;
        }
        return b.goldCollected - a.goldCollected;
      })
      .slice(0, 10);

    if (sorted.length == 0) {
      content += "\nNo records yet. Complete a game to appear here!\n";
    } else {
      sorted.forEach((entry, index) => {
        const date = new Date(entry.timestamp).toLocaleDateString();
        const rank = (index + 1).toString().padStart(2);
        const level = entry.achievedLevel.toString().padStart(2);
        const gold = entry.goldCollected.toString().padStart(6);
        const kills = entry.enemiesKilled.toString().padStart(5);
        content += ` ${rank}     ${level}     ${gold}     ${kills}        ${date}\n`;
      });
    }

    content += "\nPress ENTER to return to menu";

    leaderboardBox.setContent(content);
    this._screen.render();

    this._currentLeaderboardBox = leaderboardBox;
    this._currentScreen = "leaderboard";
  }

  clearScreen() {
    if (this._gameBox) this._gameBox.detach();
    if (this._statusBox) this._statusBox.detach();
    if (this._inventoryBox) this._inventoryBox.detach();
    if (this._messageBox) this._messageBox.detach();
    if (this._miniMapBox) {
      this._miniMapBox.detach();
      this._miniMapBox = null;
    }
    if (this._currentMenuBox) this._currentMenuBox.detach();
    if (this._currentStatsBox) this._currentStatsBox.detach();
    if (this._currentLeaderboardBox) this._currentLeaderboardBox.detach();

    this._screen.children.forEach((child) => {
      if (child.detach) child.detach();
    });
  }

  getScreen() {
    return this._screen;
  }

  setCurrentLevelIndex(index) {
    this._currentLevelIndex = index;
  }

  updateGame(level, player) {
    this._updateGameDisplay(level, player);
  }
}

export default View;
