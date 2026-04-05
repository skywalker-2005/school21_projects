import crypto from "crypto";

export function createInitialGameState(gameInstance) {
  return {
    currentLevelIndex: gameInstance.currentLevelIndex,
    isGameOver: gameInstance.isGameOver,
    difficulty: gameInstance.difficulty,
    player: {
      x: gameInstance.player.x,
      y: gameInstance.player.y,
      health: gameInstance.player.health,
      maxHealth: gameInstance.player.maxHealth,
      strength: gameInstance.player.strength,
      agility: gameInstance.player.agility,
      gold: gameInstance.player.gold,
      viewAngle: gameInstance.player.viewAngle,
      fov: gameInstance.player.fov,
      viewDistance: gameInstance.player.viewDistance,
      food: gameInstance.player.food.map((item) => ({
        type: item.type,
        subtype: item.subtype,
        health: item.health,
      })),
      potions: gameInstance.player.potions.map((item) => ({
        type: item.type,
        subtype: item.subtype,
        strength: item.strength,
        agility: item.agility,
        maxHealth: item.maxHealth,
      })),
      scrolls: gameInstance.player.scrolls.map((item) => ({
        type: item.type,
        subtype: item.subtype,
        strength: item.strength,
        agility: item.agility,
        maxHealth: item.maxHealth,
      })),
      weapons: gameInstance.player.weapons.map((item) => ({
        type: item.type,
        subtype: item.subtype,
        strength: item.strength,
      })),
      weapon: gameInstance.player.weapon
        ? {
            subtype: gameInstance.player.weapon.subtype,
            strength: gameInstance.player.weapon.strength,
          }
        : null,
      keys: gameInstance.player.keys.map((key) => ({
        type: key.type,
        subtype: key.subtype,
      })),
    },
    stats: { ...gameInstance.stats },
    currentLevel: {
      index: gameInstance.currentLevel.index,
      exploredRooms: Array.from(gameInstance.currentLevel.exploredRooms),
      exploredCorridors: Array.from(
        gameInstance.currentLevel.exploredCorridors,
      ),
      seenDoors: Array.from(gameInstance.currentLevel.seenDoors),
      rooms: gameInstance.currentLevel.rooms.map((room) => ({
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
        enemies: room.enemies
          .filter((enemy) => enemy.health > 0)
          .map((enemy) => ({
            type: enemy.constructor.name,
            x: enemy.x,
            y: enemy.y,
            health: enemy.health,
            strength: enemy.strength,
            agility: enemy.agility,
            firstAttack: enemy.firstAttack,
            isDead: enemy.isDead,
            invisible: enemy.invisible,
            resting: enemy.resting,
            direction: enemy.direction,
          })),
        items: room.items.map((item) => ({
          type: item.type,
          subtype: item.subtype,
          x: item.x,
          y: item.y,
          strength: item.strength,
          agility: item.agility,
          health: item.health,
          maxHealth: item.maxHealth,
        })),
      })),
      corridors: gameInstance.currentLevel.corridors.map((corridor) => ({
        cells: corridor.cells,
      })),
    },
  };
}

export function createStatisticsEntry(gameInstance, victory) {
  if (!gameInstance) {
    console.error("Game instance is null or undefined");
    return {
      sessionId: generateSessionId(),
      achievedLevel: 0,
      completionStatus: victory ? "victory" : "defeat",
      finalTimestamp: new Date().toISOString(),
      stats: {},
    };
  }

  return {
    sessionId: generateSessionId(),
    achievedLevel: (gameInstance.currentLevelIndex || 0) + 1,
    completionStatus: victory ? "victory" : "defeat",
    finalTimestamp: new Date().toISOString(),
    stats: { ...(gameInstance.stats || {}) },
  };
}

export function createLeaderboardEntry(gameInstance) {
  return {
    sessionId: generateSessionId(),
    achievedLevel: (gameInstance.currentLevelIndex || 0) + 1,
    goldCollected: gameInstance.stats?.gold || 0,
    enemiesKilled: gameInstance.stats?.enemiesKilled || 0,
    timestamp: new Date().toISOString(),
  };
}

function generateSessionId() {
  if (typeof crypto != "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "id_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}
