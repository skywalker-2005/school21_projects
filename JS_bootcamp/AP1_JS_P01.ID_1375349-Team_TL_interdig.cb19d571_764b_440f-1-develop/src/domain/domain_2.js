import {
  Item,
  Player,
  Enemy,
  Zombie,
  Ghost,
  Vampire,
  Ogre,
  Snake,
  Mimic,
} from "./domain_1.js";

/////////////
// КОМНАТА //
/////////////

export class Room {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.doors = [];
    this.enemies = [];
    this.items = [];
    this.isStart = false;
    this.isEnd = false;
    this.isEnd = false;
    this.isExit = false;
    this.exitX = null;
    this.exitY = null;
  }

  getActorAt(x, y) {
    for (const enemy of this.enemies) {
      if (enemy.x == x && enemy.y == y) return enemy;
    }
    for (const item of this.items) {
      if (item.x == x && item.y == y) return item;
    }
    return null;
  }

  addDoor(x, y, color = "white") {
    this.doors.push({ x, y, color });
  }

  addEnemy(enemy) {
    enemy.room = this;
    this.enemies.push(enemy);
  }

  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index != -1) this.enemies.splice(index, 1);
  }

  placeItem(item) {
    this.items.push(item);
  }

  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index != -1) this.items.splice(index, 1);
  }
}

/////////////
// КОРИДОР //
/////////////

export class Corridor {
  constructor(cells) {
    this.cells = cells;
  }
}

/////////////
// УРОВЕНЬ //
/////////////

export class Level {
  constructor(index, rooms, corridors) {
    this.index = index;
    this.rooms = rooms;
    this.corridors = corridors;
    this.startRoom = rooms.find((r) => r.isStart);
    this.exitRoom = rooms.find((r) => r.isEnd);
    this.exploredRooms = new Set();
    this.exploredCorridors = new Set();
    this.doorPositions = new Set();
    this.currentRoomIndex = null;
    this.currentCorridorIndex = null;
    this.seenDoors = new Set();

    for (const room of rooms) {
      for (const door of room.doors) {
        this.doorPositions.add(`${door.x},${door.y}`);
      }
    }
  }

  getDoorColor(x, y) {
    for (const room of this.rooms) {
      for (const door of room.doors) {
        if (door.x == x && door.y == y) {
          return door.color || "white";
        }
      }
    }
    return "white";
  }

  markDoorAsSeen(x, y) {
    this.seenDoors.add(`${x},${y}`);
  }

  isDoorSeen(x, y) {
    return this.seenDoors.has(`${x},${y}`);
  }

  updateCurrentPosition(player) {
    const roomInfo = this.getCurrentRoom(player);
    if (roomInfo) {
      this.currentRoomIndex = roomInfo.index;
      this.currentCorridorIndex = null;
    } else {
      const corridorInfo = this.getCurrentCorridor(player);
      if (corridorInfo) {
        this.currentCorridorIndex = corridorInfo.index;
        this.currentRoomIndex = null;
      } else {
        this.currentRoomIndex = null;
        this.currentCorridorIndex = null;
      }
    }
  }

  isDoorCell(x, y) {
    return this.doorPositions.has(`${x},${y}`);
  }

  isVisible(x, y, player) {
    if (this.isDoorCell(x, y)) {
      for (let i = 0; i < this.rooms.length; i++) {
        const room = this.rooms[i];
        for (const door of room.doors) {
          if (door.x == x && door.y == y) {
            if (
              this.exploredRooms.has(i) ||
              this.isDoorSeen(x, y) ||
              (player && player.x == x && player.y == y)
            ) {
              return { visible: true, showContent: true };
            }
            if (this.currentCorridorIndex != null && player) {
              const currentCorridor = this.corridors[this.currentCorridorIndex];
              if (currentCorridor) {
                for (const cell of currentCorridor.cells) {
                  const adjacentCells = [
                    { x: cell.x + 1, y: cell.y },
                    { x: cell.x - 1, y: cell.y },
                    { x: cell.x, y: cell.y + 1 },
                    { x: cell.x, y: cell.y - 1 },
                  ];

                  for (const adj of adjacentCells) {
                    if (adj.x == x && adj.y == y) {
                      return { visible: true, showContent: true };
                    }
                  }
                }
              }
            }

            return { visible: false, showContent: false };
          }
        }
      }
    }

    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      if (
        x >= room.x &&
        x < room.x + room.width &&
        y >= room.y &&
        y < room.y + room.height
      ) {
        if (this.exploredRooms.has(i)) {
          if (this.currentRoomIndex == i) {
            return { visible: true, showContent: true };
          } else {
            return { visible: true, showContent: false };
          }
        } else {
          return { visible: false, showContent: false };
        }
      }
    }

    for (let i = 0; i < this.corridors.length; i++) {
      const corridor = this.corridors[i];
      for (const cell of corridor.cells) {
        if (cell.x == x && cell.y == y) {
          if (this.exploredCorridors.has(i)) {
            if (this.currentCorridorIndex == i) {
              return { visible: true, showContent: true };
            } else {
              return { visible: true, showContent: false };
            }
          } else {
            return { visible: false, showContent: false };
          }
        }
      }
    }

    return { visible: true, showContent: false };
  }

  getActorAt(x, y) {
    for (const room of this.rooms) {
      if (
        x >= room.x &&
        x < room.x + room.width &&
        y >= room.y &&
        y < room.y + room.height
      ) {
        const actor = room.getActorAt(x, y);
        if (actor) return actor;
      }
    }

    for (const corridor of this.corridors) {
      for (const cell of corridor.cells) {
        if (cell.x == x && cell.y == y) {
          return null;
        }
      }
    }
    return null;
  }

  exploreRoom(roomIndex) {
    this.exploredRooms.add(roomIndex);
  }

  isWalkable(x, y) {
    if (this.isDoorCell(x, y)) return true;
    const inRoom = this.rooms.some((room) => {
      return (
        x >= room.x &&
        x < room.x + room.width &&
        y >= room.y &&
        y < room.y + room.height
      );
    });
    const inCorridor = this.corridors.some((corr) => {
      return corr.cells.some((cell) => cell.x == x && cell.y == y);
    });
    return inRoom || inCorridor;
  }

  isDoor(x, y) {
    if (!this.isDoorCell(x, y)) return false;
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      for (const door of room.doors) {
        if (door.x == x && door.y == y) {
          if (this.exploredRooms.has(i) || this.isDoorSeen(x, y)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  placePlayer(player, room) {
    const freeCells = [];
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (!this.getActorAt(x, y)) {
          freeCells.push({ x, y });
        }
      }
    }
    if (freeCells.length > 0) {
      const randomCell =
        freeCells[Math.floor(Math.random() * freeCells.length)];
      player.x = randomCell.x;
      player.y = randomCell.y;
      return true;
    }
    return false;
  }

  getCurrentRoom(player) {
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      const isInside =
        player.x >= room.x &&
        player.x < room.x + room.width &&
        player.y >= room.y &&
        player.y < room.y + room.height;

      let isOnDoor = false;
      for (const door of room.doors) {
        if (door.x == player.x && door.y == player.y) {
          isOnDoor = true;
          break;
        }
      }

      if (isInside || isOnDoor) {
        return { index: i, room: room };
      }
    }
    return null;
  }

  getCurrentCorridor(player) {
    for (let i = 0; i < this.corridors.length; i++) {
      const corridor = this.corridors[i];
      for (const cell of corridor.cells) {
        if (cell.x == player.x && cell.y == player.y) {
          return { index: i, corridor: corridor };
        }
      }
    }
    return null;
  }

  exploreCurrentPosition(player) {
    this.updateCurrentPosition(player);

    if (this.isDoorCell(player.x, player.y)) {
      this.markDoorAsSeen(player.x, player.y);

      for (const corridor of this.corridors) {
        for (const cell of corridor.cells) {
          const adjacentCells = [
            { x: cell.x + 1, y: cell.y },
            { x: cell.x - 1, y: cell.y },
            { x: cell.x, y: cell.y + 1 },
            { x: cell.x, y: cell.y - 1 },
          ];

          for (const adj of adjacentCells) {
            if (adj.x == player.x && adj.y == player.y) {
              const corridorIndex = this.corridors.indexOf(corridor);
              if (
                corridorIndex != -1 &&
                !this.exploredCorridors.has(corridorIndex)
              ) {
                this.exploredCorridors.add(corridorIndex);
              }

              for (const room of this.rooms) {
                for (const door of room.doors) {
                  for (const cell2 of corridor.cells) {
                    const adjacentCells2 = [
                      { x: cell2.x + 1, y: cell2.y },
                      { x: cell2.x - 1, y: cell2.y },
                      { x: cell2.x, y: cell2.y + 1 },
                      { x: cell2.x, y: cell2.y - 1 },
                    ];

                    for (const adj2 of adjacentCells2) {
                      if (
                        door.x == adj2.x &&
                        door.y == adj2.y &&
                        !(door.x == player.x && door.y == player.y)
                      ) {
                        this.markDoorAsSeen(door.x, door.y);
                        break;
                      }
                    }
                  }
                }
              }
              break;
            }
          }
        }
      }
    }

    const roomInfo = this.getCurrentRoom(player);
    if (roomInfo) {
      if (!this.exploredRooms.has(roomInfo.index)) {
        this.exploreRoom(roomInfo.index);
      }
    } else {
      const corridorInfo = this.getCurrentCorridor(player);
      if (corridorInfo) {
        if (!this.exploredCorridors.has(corridorInfo.index)) {
          this.exploredCorridors.add(corridorInfo.index);
        }
      }
    }
  }

  getExit() {
    for (const room of this.rooms) {
      if (room.isExit && room.exitX != null && room.exitY != null) {
        return { x: room.exitX, y: room.exitY, room: room };
      }
    }
    return null;
  }

  isExitCell(x, y) {
    const exit = this.getExit();
    return exit && exit.x == x && exit.y == y;
  }

  static generate(index, difficulty) {
    const gridSize = 3;
    const rooms = [];

    const minWidth = 12;
    const maxWidth = 20;
    const minHeight = 6;
    const maxHeight = 10;

    const minHorizontalSpacing = 8;
    const maxHorizontalSpacing = 12;
    const minVerticalSpacing = 4;
    const maxVerticalSpacing = 6;

    const roomGrid = [];

    for (let i = 0; i < gridSize; i++) {
      roomGrid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const width = Math.floor(
          Math.random() * (maxWidth - minWidth + 1) + minWidth,
        );
        const height = Math.floor(
          Math.random() * (maxHeight - minHeight + 1) + minHeight,
        );

        let x, y;

        if (j == 0) {
          x = 2;
        } else {
          const prevRoom = roomGrid[i][j - 1];
          const horizontalSpacing = Math.floor(
            Math.random() * (maxHorizontalSpacing - minHorizontalSpacing + 1) +
              minHorizontalSpacing,
          );
          x = prevRoom.x + prevRoom.width + horizontalSpacing;
        }

        if (i == 0) {
          y = 1;
        } else {
          const prevRoom = roomGrid[i - 1][j];
          const verticalSpacing = Math.floor(
            Math.random() * (maxVerticalSpacing - minVerticalSpacing + 1) +
              minVerticalSpacing,
          );
          y = prevRoom.y + prevRoom.height + verticalSpacing;
        }

        const room = new Room(x, y, width, height);
        roomGrid[i][j] = room;
        rooms.push(room);
      }
    }

    const startRoomIndex = Math.floor(Math.random() * rooms.length);
    let endRoomIndex;
    do {
      endRoomIndex = Math.floor(Math.random() * rooms.length);
    } while (endRoomIndex == startRoomIndex);

    rooms[startRoomIndex].isStart = true;
    rooms[endRoomIndex].isEnd = true;

    let exitRoom;
    let attempts = 0;
    do {
      const randomIndex = Math.floor(Math.random() * rooms.length);
      exitRoom = rooms[randomIndex];
      attempts++;
    } while ((exitRoom.isStart || exitRoom.isExit) && attempts < 50);

    if (exitRoom) {
      exitRoom.isExit = true;
      let placed = false;
      let placeAttempts = 0;

      while (!placed && placeAttempts < 100) {
        const exitX =
          exitRoom.x + 1 + Math.floor(Math.random() * (exitRoom.width - 2));
        const exitY =
          exitRoom.y + 1 + Math.floor(Math.random() * (exitRoom.height - 2));

        let occupied = false;

        for (const enemy of exitRoom.enemies) {
          if (enemy.x == exitX && enemy.y == exitY) {
            occupied = true;
            break;
          }
        }

        if (!occupied) {
          for (const item of exitRoom.items) {
            if (item.x == exitX && item.y == exitY) {
              occupied = true;
              break;
            }
          }
        }

        let isDoor = false;
        for (const door of exitRoom.doors) {
          if (door.x == exitX && door.y == exitY) {
            isDoor = true;
            break;
          }
        }

        if (!occupied && !isDoor) {
          exitRoom.exitX = exitX;
          exitRoom.exitY = exitY;
          placed = true;
        }

        placeAttempts++;
      }

      if (!placed) exitRoom.isExit = false;
    }

    const allCorridors = [];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        const room1 = roomGrid[i][j];
        const room2 = roomGrid[i][j + 1];
        const yOverlapStart = Math.max(room1.y, room2.y);
        const yOverlapEnd = Math.min(
          room1.y + room1.height,
          room2.y + room2.height,
        );

        if (yOverlapEnd - yOverlapStart >= 3) {
          const minY = yOverlapStart + 1;
          const maxY = yOverlapEnd - 2;
          const doorY = Math.floor(Math.random() * (maxY - minY + 1) + minY);
          const door1X = room1.x + room1.width;
          const door2X = room2.x - 1;
          allCorridors.push({
            type: "horizontal",
            room1,
            room2,
            door1X,
            doorY,
            door2X,
          });
        }
      }
    }

    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize; j++) {
        const room1 = roomGrid[i][j];
        const room2 = roomGrid[i + 1][j];
        const xOverlapStart = Math.max(room1.x, room2.x);
        const xOverlapEnd = Math.min(
          room1.x + room1.width,
          room2.x + room2.width,
        );

        if (xOverlapEnd - xOverlapStart >= 3) {
          const minX = xOverlapStart + 1;
          const maxX = xOverlapEnd - 2;
          const doorX = Math.floor(Math.random() * (maxX - minX + 1) + minX);
          const door1Y = room1.y + room1.height;
          const door2Y = room2.y - 1;
          allCorridors.push({
            type: "vertical",
            room1,
            room2,
            doorX,
            door1Y,
            door2Y,
          });
        }
      }
    }

    const usedColors = new Set();
    const coloredCorridors = [];
    let coloredDoorsCount = 0;

    if (difficulty > 150) coloredDoorsCount = 3;
    else if (difficulty > 100) coloredDoorsCount = 2;
    else if (difficulty > 50) coloredDoorsCount = 1;

    if (coloredDoorsCount > 0 && allCorridors.length > 0) {
      const shuffled = [...allCorridors];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const toColor = shuffled.slice(
        0,
        Math.min(coloredDoorsCount, allCorridors.length),
      );

      for (const corridorInfo of toColor) {
        let doorColor;
        do {
          doorColor = getRandom(["red", "blue", "yellow"]);
        } while (usedColors.has(doorColor) && usedColors.size < 3);

        usedColors.add(doorColor);
        coloredCorridors.push({ ...corridorInfo, color: doorColor });
      }
    }

    const corridors = [];
    for (const corridorInfo of allCorridors) {
      const coloredInfo = coloredCorridors.find(
        (c) => c.room1 == corridorInfo.room1 && c.room2 == corridorInfo.room2,
      );
      const doorColor = coloredInfo ? coloredInfo.color : "white";

      if (corridorInfo.type == "horizontal") {
        const cells = [];
        const startX = Math.min(corridorInfo.door1X, corridorInfo.door2X);
        const endX = Math.max(corridorInfo.door1X, corridorInfo.door2X);
        for (let x = startX + 1; x < endX; x++)
          cells.push({ x: x, y: corridorInfo.doorY });
        corridorInfo.room1.addDoor(
          corridorInfo.door1X,
          corridorInfo.doorY,
          doorColor,
        );
        corridorInfo.room2.addDoor(
          corridorInfo.door2X,
          corridorInfo.doorY,
          doorColor,
        );
        const corridor = new Corridor(cells);
        corridors.push(corridor);
      } else if (corridorInfo.type == "vertical") {
        const cells = [];
        const startY = Math.min(corridorInfo.door1Y, corridorInfo.door2Y);
        const endY = Math.max(corridorInfo.door1Y, corridorInfo.door2Y);
        for (let y = startY + 1; y < endY; y++)
          cells.push({ x: corridorInfo.doorX, y: y });
        corridorInfo.room1.addDoor(
          corridorInfo.doorX,
          corridorInfo.door1Y,
          doorColor,
        );
        corridorInfo.room2.addDoor(
          corridorInfo.doorX,
          corridorInfo.door2Y,
          doorColor,
        );
        const corridor = new Corridor(cells);
        corridors.push(corridor);
      }
    }

    const startRoom = rooms.find((r) => r.isStart);

    for (const coloredCorridor of coloredCorridors) {
      const accessibleRooms = getAccessibleRooms(
        startRoom,
        allCorridors,
        coloredCorridors,
        true,
      );

      let keyRoom = null;
      let availableRooms = [];

      const doorRooms = [coloredCorridor.room1, coloredCorridor.room2];
      const excludeRooms = new Set(doorRooms);

      for (const doorRoom of doorRooms) {
        if (accessibleRooms.has(doorRoom)) {
          const distantRooms = findRoomsAtDistance(
            doorRoom,
            2,
            4,
            allCorridors,
            excludeRooms,
          );

          const accessibleDistantRooms = distantRooms.filter((room) =>
            accessibleRooms.has(room),
          );
          availableRooms.push(...accessibleDistantRooms);
        }
      }

      availableRooms = [...new Set(availableRooms)];

      if (availableRooms.length > 0) {
        const roomsWithDistance = availableRooms.map((room) => ({
          room,
          distanceFromStart: getRoomDistance(startRoom, room, allCorridors),
        }));

        roomsWithDistance.sort(
          (a, b) => b.distanceFromStart - a.distanceFromStart,
        );
        const topRooms = roomsWithDistance.slice(
          0,
          Math.ceil(roomsWithDistance.length / 2),
        );
        keyRoom = getRandom(topRooms.map((r) => r.room));
      }

      if (!keyRoom) {
        for (const doorRoom of doorRooms) {
          if (accessibleRooms.has(doorRoom)) {
            const nearbyRooms = findRoomsAtDistance(
              doorRoom,
              1,
              2,
              allCorridors,
              excludeRooms,
            );
            const accessibleNearby = nearbyRooms.filter((room) =>
              accessibleRooms.has(room),
            );
            if (accessibleNearby.length > 0) {
              keyRoom = getRandom(accessibleNearby);
              break;
            }
          }
        }
      }

      if (!keyRoom) {
        const allAccessible = Array.from(accessibleRooms).filter(
          (room) =>
            !excludeRooms.has(room) &&
            !room.isStart &&
            !room.isEnd &&
            !room.isExit,
        );
        if (allAccessible.length > 0) {
          keyRoom = getRandom(allAccessible);
        } else {
          keyRoom = accessibleRooms.has(coloredCorridor.room1)
            ? coloredCorridor.room1
            : coloredCorridor.room2;
        }
      }

      if (keyRoom) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 50) {
          const x =
            keyRoom.x + 1 + Math.floor(Math.random() * (keyRoom.width - 2));
          const y =
            keyRoom.y + 1 + Math.floor(Math.random() * (keyRoom.height - 2));

          let occupied = false;
          for (const enemy of keyRoom.enemies) {
            if (enemy.x == x && enemy.y == y) {
              occupied = true;
              break;
            }
          }
          for (const item of keyRoom.items) {
            if (item.x == x && item.y == y) {
              occupied = true;
              break;
            }
          }

          if (!occupied) {
            const keyType =
              coloredCorridor.color == "red"
                ? "Red Key"
                : coloredCorridor.color == "blue"
                  ? "Blue Key"
                  : coloredCorridor.color == "yellow"
                    ? "Yellow Key"
                    : null;
            if (keyType) {
              const key = new Item(x, y, "key", keyType);
              keyRoom.placeItem(key);
              placed = true;
            }
          }
          attempts++;
        }
      }
    }

    const enemyTable = createEnemyTable(difficulty);

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];

      if (room.isStart) continue;
      if (room.isEnd) continue;

      let enemyCount;
      if (difficulty < 50) enemyCount = Math.floor(Math.random() * 2);
      else if (difficulty < 100) enemyCount = Math.floor(Math.random() * 2) + 1;
      else if (difficulty < 150) enemyCount = Math.floor(Math.random() * 3) + 1;
      else enemyCount = Math.floor(Math.random() * 3) + 2;

      for (let e = 0; e < enemyCount; e++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 50) {
          const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
          const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

          let occupied = false;

          for (const existingEnemy of room.enemies) {
            if (existingEnemy.x == x && existingEnemy.y == y) {
              occupied = true;
              break;
            }
          }

          if (!occupied) {
            for (const existingItem of room.items) {
              if (existingItem.x == x && existingItem.y == y) {
                occupied = true;
                break;
              }
            }
          }

          if (!occupied) {
            const enemy = spawnRandomEnemy(x, y, enemyTable, room);
            if (enemy) {
              room.addEnemy(enemy);
              placed = true;
            }
          }
          attempts++;
        }
      }

      let itemCount;
      if (difficulty < 50) itemCount = Math.floor(Math.random() * 3) + 2;
      else if (difficulty < 100) itemCount = Math.floor(Math.random() * 2) + 1;
      else if (difficulty < 150) itemCount = Math.floor(Math.random() * 2) + 1;
      else itemCount = Math.floor(Math.random() * 2);

      for (let it = 0; it < itemCount; it++) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 50) {
          const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
          const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

          const existingActor = room.getActorAt(x, y);
          if (!existingActor) {
            const item = spawnRandomItem(x, y);
            room.placeItem(item);
            placed = true;
          }
          attempts++;
        }
      }
    }

    return new Level(index, rooms, corridors);
  }

  toJSON() {
    return {
      index: this.index,
      rooms: this.rooms.map((room) => ({
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
        doors: room.doors,
        isStart: room.isStart,
        isEnd: room.isEnd,
        isExit: room.isExit,
        exitX: room.exitX,
        exitY: room.exitY,
      })),
      corridors: this.corridors.map((corridor) => ({
        cells: corridor.cells,
      })),
    };
  }

  static fromJSON(data) {
    const rooms = data.rooms.map((roomData) => {
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
      return room;
    });

    const corridors = data.corridors.map(
      (corridorData) => new Corridor(corridorData.cells),
    );

    const level = new Level(data.index, rooms, corridors);
    return level;
  }
}

//////////
// ИГРА //
//////////

export class Game {
  constructor(player) {
    this.player = player;
    this.currentLevelIndex = 0;
    this.levels = [];
    this.isGameOver = false;
    this.difficulty = 100;
    this.Level = Level;
    this.stats = {
      gold: 0,
      maxLevel: 1,
      enemiesKilled: 0,
      foodEaten: 0,
      potionsDrunk: 0,
      scrollsRead: 0,
      hitsDealt: 0,
      hitsTaken: 0,
      steps: 0,
    };
  }

  adjustDifficulty(amount) {
    this.difficulty = Math.max(0, Math.min(200, this.difficulty + amount));
    return this.difficulty;
  }

  startNewGame(startPosition = null) {
    this.difficulty = 100;
    const level = Level.generate(0, this.difficulty);
    this.levels.push(level);
    this.currentLevel = level;
    this.currentLevelIndex = 0;

    const startRoom = level.startRoom;

    const startRoomIndex = level.rooms.findIndex((room) => room == startRoom);
    if (startRoomIndex != -1) level.exploreRoom(startRoomIndex);

    if (startPosition) {
      this.player.x = startPosition.x;
      this.player.y = startPosition.y;
    } else {
      const freeCells = [];
      for (let y = startRoom.y; y < startRoom.y + startRoom.height; y++) {
        for (let x = startRoom.x; x < startRoom.x + startRoom.width; x++) {
          if (!level.getActorAt(x, y)) {
            freeCells.push({ x, y });
          }
        }
      }

      if (freeCells.length > 0) {
        const randomCell =
          freeCells[Math.floor(Math.random() * freeCells.length)];
        this.player.x = randomCell.x;
        this.player.y = randomCell.y;
      }
    }

    level.exploreCurrentPosition(this.player);
  }

  movePlayer(dx, dy) {
    const result = this.player.move(dx, dy, this.currentLevel);

    if (!result.success) return result;

    if (result.action == "attack") {
      return result;
    } else if (result.action == "pickup") {
      if (this.player.addItem(result.target)) {
        this.removeItemFromLevel(result.target);
      }
      this.stats.steps++;
      return result;
    } else if (result.action == "exit") {
      this.stats.steps++;
      return result;
    } else if (result.action == "move") {
      this.stats.steps++;
      return result;
    }

    return result;
  }

  removeItemFromLevel(item) {
    for (const room of this.currentLevel.rooms) {
      const index = room.items.indexOf(item);
      if (index != -1) {
        room.items.splice(index, 1);
        break;
      }
    }
  }

  handleCombat(attacker, defender) {
    if (attacker instanceof Player && defender instanceof Enemy) {
      const attackResult = attacker.attack(defender);
      this.stats.hitsDealt++;
      if (attackResult.hit) {
        if (defender.takeDamage(attackResult.damage)) {
          this.stats.enemiesKilled++;
          this.stats.gold += Math.floor(Math.random() * 50) + 10;
          this.difficulty = Math.min(this.difficulty + 5, 200);
          this.removeEnemyFromLevel(defender);
          return;
        }
      }

      const enemyAttack = defender.attack(attacker);
      this.stats.hitsTaken++;

      if (enemyAttack.hit) {
        const playerDead = attacker.takeDamage(enemyAttack.damage);
        if (playerDead) {
          this.endGame();
        }
      }
    }
  }

  removeEnemyFromLevel(enemy) {
    for (const room of this.currentLevel.rooms) {
      const index = room.enemies.indexOf(enemy);
      if (index != -1) {
        room.enemies.splice(index, 1);
        if (Math.random() < 0.3) {
          const item = spawnRandomItem(enemy.x, enemy.y);
          room.placeItem(item);
        }
        break;
      }
    }
  }

  endGame() {
    this.isGameOver = true;
  }
}

///////////////
// ГЕНЕРАЦИЯ //
///////////////

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function spawnRandomItem(x, y) {
  const type = getRandom(["food", "potion", "scroll", "weapon"]);

  const quality = getRandom(["Lesser", "Medium", "Great"]);
  const stat = getRandom(["Strength", "Agility", "Health"]);
  let subtype = "";

  switch (type) {
    case "food":
      subtype = getRandom([
        "Apple",
        "Wine",
        "Cheese",
        "Chicken",
        "Stew",
        "Steak",
      ]);
      break;
    case "potion":
      subtype = `${quality} Potion of ${stat}`;
      break;
    case "scroll":
      subtype = `${quality} Scroll of ${stat}`;
      break;
    case "weapon":
      subtype = getRandom([
        "Dagger",
        "Short Sword",
        "Long Sword",
        "Battle Axe",
        "Great Sword",
        "Legendary Sword",
      ]);
      break;
    default:
      this.char = "?";
      break;
  }

  const item = new Item(x, y, type, subtype);
  return item;
}

function interpolate(easyRate, normalRate, hardRate, difficulty) {
  return Math.round(
    difficulty < 100
      ? easyRate * (1 - difficulty / 100) + (normalRate * difficulty) / 100
      : normalRate * (1 - (difficulty - 100) / 100) +
          (hardRate * (difficulty - 100)) / 100,
  );
}

function createEnemyTable(difficulty) {
  const enemies = [];
  difficulty = Math.max(0, Math.min(200, difficulty));

  const normalRates = {
    zombie: 30,
    vampire: 10,
    ghost: 20,
    ogre: 10,
    snake: 20,
    mimic: 10,
  };

  const easyRates = {
    zombie: 50,
    vampire: 0,
    ghost: 30,
    ogre: 0,
    snake: 20,
    mimic: 10,
  };

  const hardRates = {
    zombie: 20,
    vampire: 20,
    ghost: 15,
    ogre: 20,
    snake: 15,
    mimic: 10,
  };

  const finalRates = {
    zombie: interpolate(
      easyRates.zombie,
      normalRates.zombie,
      hardRates.zombie,
      difficulty,
    ),
    vampire: interpolate(
      easyRates.vampire,
      normalRates.vampire,
      hardRates.vampire,
      difficulty,
    ),
    ghost: interpolate(
      easyRates.ghost,
      normalRates.ghost,
      hardRates.ghost,
      difficulty,
    ),
    ogre: interpolate(
      easyRates.ogre,
      normalRates.ogre,
      hardRates.ogre,
      difficulty,
    ),
    snake: interpolate(
      easyRates.snake,
      normalRates.snake,
      hardRates.snake,
      difficulty,
    ),
    mimic: interpolate(
      easyRates.mimic,
      normalRates.mimic,
      hardRates.mimic,
      difficulty,
    ),
  };

  const total = Object.values(finalRates).reduce((sum, val) => sum + val, 0);
  if (total != 100) {
    const diff = 100 - total;
    const maxKey = Object.keys(finalRates).reduce((a, b) =>
      finalRates[a] > finalRates[b] ? a : b,
    );
    finalRates[maxKey] += diff;
  }

  for (let i = 0; i < finalRates.zombie; i++) enemies.push(Zombie);
  for (let i = 0; i < finalRates.vampire; i++) enemies.push(Vampire);
  for (let i = 0; i < finalRates.ghost; i++) enemies.push(Ghost);
  for (let i = 0; i < finalRates.ogre; i++) enemies.push(Ogre);
  for (let i = 0; i < finalRates.snake; i++) enemies.push(Snake);
  for (let i = 0; i < finalRates.mimic; i++) enemies.push(Mimic);

  return enemies;
}

function spawnRandomEnemy(x, y, table, room = null) {
  const EnemyClass = getRandom(table);
  const enemy = new EnemyClass(x, y);
  enemy.room = room;
  return enemy;
}

function findRoomsAtDistance(
  startRoom,
  minDistance,
  maxDistance,
  allCorridors,
  excludeRooms = new Set(),
) {
  const visited = new Map();
  const queue = [{ room: startRoom, distance: 0 }];
  visited.set(startRoom, 0);

  while (queue.length > 0) {
    const { room, distance } = queue.shift();

    for (const corridor of allCorridors) {
      let neighborRoom = null;

      if (corridor.room1 == room) neighborRoom = corridor.room2;
      else if (corridor.room2 == room) neighborRoom = corridor.room1;

      if (neighborRoom && !visited.has(neighborRoom)) {
        const newDistance = distance + 1;
        visited.set(neighborRoom, newDistance);
        queue.push({ room: neighborRoom, distance: newDistance });
      }
    }
  }

  const result = [];
  for (const [room, distance] of visited) {
    if (
      distance >= minDistance &&
      distance <= maxDistance &&
      !excludeRooms.has(room) &&
      !room.isStart &&
      !room.isEnd &&
      !room.isExit
    ) {
      result.push(room);
    }
  }

  return result;
}

function getRoomDistance(room1, room2, allCorridors) {
  const visited = new Set();
  const queue = [{ room: room1, distance: 0 }];
  visited.add(room1);

  while (queue.length > 0) {
    const { room, distance } = queue.shift();

    if (room == room2) return distance;

    for (const corridor of allCorridors) {
      let neighborRoom = null;

      if (corridor.room1 == room) neighborRoom = corridor.room2;
      else if (corridor.room2 == room) neighborRoom = corridor.room1;

      if (neighborRoom && !visited.has(neighborRoom)) {
        visited.add(neighborRoom);
        queue.push({ room: neighborRoom, distance: distance + 1 });
      }
    }
  }

  return Infinity;
}

function getAccessibleRooms(
  startRoom,
  allCorridors,
  coloredCorridors,
  excludeColoredDoors = true,
) {
  const accessible = new Set();
  const queue = [startRoom];
  accessible.add(startRoom);

  while (queue.length > 0) {
    const currentRoom = queue.shift();

    for (const corridor of allCorridors) {
      let neighborRoom = null;
      let isColored = false;

      if (corridor.room1 == currentRoom) {
        neighborRoom = corridor.room2;
        isColored = coloredCorridors.some(
          (c) =>
            (c.room1 == corridor.room1 && c.room2 == corridor.room2) ||
            (c.room1 == corridor.room2 && c.room2 == corridor.room1),
        );
      } else if (corridor.room2 == currentRoom) {
        neighborRoom = corridor.room1;
        isColored = coloredCorridors.some(
          (c) =>
            (c.room1 == corridor.room1 && c.room2 == corridor.room2) ||
            (c.room1 == corridor.room2 && c.room2 == corridor.room1),
        );
      }

      if (
        neighborRoom &&
        (!excludeColoredDoors || !isColored) &&
        !accessible.has(neighborRoom)
      ) {
        accessible.add(neighborRoom);
        queue.push(neighborRoom);
      }
    }
  }

  return accessible;
}
