import fs from "fs/promises";
import path from "path";

async function initializeDataFiles() {
  const dataDir = path.join(process.cwd(), "saves");

  try {
    await fs.mkdir(dataDir, { recursive: true });

    const savegamePath = path.join(dataDir, "savegame.json");
    const statisticsPath = path.join(dataDir, "statistics.json");
    const leaderboardPath = path.join(dataDir, "leaderboard.json");
    const filesToCreate = [
      { path: savegamePath, content: "{}" },
      { path: statisticsPath, content: "[]" },
      { path: leaderboardPath, content: "[]" },
    ];

    for (const file of filesToCreate) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, file.content, "utf8");
      }
    }
  } catch (error) {
    console.error("Критическая ошибка инициализации данных:", error);
    process.exit(1);
  }
}

export default initializeDataFiles;
