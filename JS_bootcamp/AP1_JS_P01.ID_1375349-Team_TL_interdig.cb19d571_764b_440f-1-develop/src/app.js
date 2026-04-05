import View from "./presentation/view.js";
import GameController from "./controllers/gameController.js";
import DataLayer from "./datalayer/datalayer.js";
import initializeDataFiles from "./datalayer/initData.js";
import { createInitialGameState } from "./datalayer/initialData.js";

async function initGame() {
  await initializeDataFiles();
  const dataLayer = new DataLayer();
  const view = new View();
  const gameController = new GameController(view, dataLayer);
  gameController.startGame();
}

initGame().catch(console.error);
