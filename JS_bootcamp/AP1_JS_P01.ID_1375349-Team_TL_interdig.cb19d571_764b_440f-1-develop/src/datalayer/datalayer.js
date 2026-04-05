import fs from "fs/promises";
import path from "path";

class DataLayer {
  constructor() {
    this.saveDir = path.join(process.cwd(), "saves");
    this.saveFile = path.join(this.saveDir, "savegame.json");
    this.statisticsFile = path.join(this.saveDir, "statistics.json");
    this.leaderboardFile = path.join(this.saveDir, "leaderboard.json");
  }

  async ensureSaveDir() {
    try {
      await fs.mkdir(this.saveDir, { recursive: true });
      return true;
    } catch (error) {
      console.error("Ошибка создания папки сохранений:", error);
      return false;
    }
  }

  async saveGame(gameState) {
    const success = await this.ensureSaveDir();
    if (!success) throw new Error("Не удалось создать папку сохранений");
    const jsonString = JSON.stringify(gameState, null, 2);
    await fs.writeFile(this.saveFile, jsonString, "utf8");
  }

  async loadGame() {
    try {
      const jsonString = await fs.readFile(this.saveFile, "utf8");
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== "object") {
        console.warn("Сохранённые данные повреждены или пусты");
        return null;
      }
      return data;
    } catch (error) {
      if (error.code === "ENOENT") {
        return null;
      }
      console.error("Ошибка загрузки сохранения:", error);
      throw error;
    }
  }

  async saveLeaderboard(leaderboard) {
    await this.ensureSaveDir();
    const sorted = [...leaderboard].sort((a, b) => {
      if (a.achievedLevel !== b.achievedLevel) {
        return b.achievedLevel - a.achievedLevel;
      }
      return b.goldCollected - a.goldCollected;
    });
    const jsonString = JSON.stringify(sorted, null, 2);
    await fs.writeFile(this.leaderboardFile, jsonString, "utf8");
  }

  async loadLeaderboard() {
    try {
      const jsonString = await fs.readFile(this.leaderboardFile, "utf8");
      return JSON.parse(jsonString);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      console.error("Ошибка загрузки лидерборда:", error);
      throw error;
    }
  }

  async deleteSave() {
    try {
      await fs.unlink(this.saveFile);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Ошибка удаления сохранения:", error);
        throw error;
      }
    }
  }

  async addToStatistics(sessionStats) {
    await this.ensureSaveDir();

    let statistics = [];
    try {
      const data = await fs.readFile(this.statisticsFile, "utf8");
      if (data && data.trim()) {
        statistics = JSON.parse(data);
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Ошибка чтения статистики:", error);
        throw error;
      }
    }

    if (!Array.isArray(statistics)) {
      statistics = [];
    }

    statistics.push(sessionStats);
    const jsonString = JSON.stringify(statistics, null, 2);
    await fs.writeFile(this.statisticsFile, jsonString, "utf8");
  }

  async loadStatistics() {
    try {
      const jsonString = await fs.readFile(this.statisticsFile, "utf8");
      return JSON.parse(jsonString);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      console.error("Ошибка загрузки статистики:", error);
      throw error;
    }
  }

  async loadStatistics() {
    try {
      const jsonString = await fs.readFile(this.statisticsFile, "utf8");
      return JSON.parse(jsonString);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      console.error("Ошибка загрузки статистики:", error);
      throw error;
    }
  }
}

export default DataLayer;
