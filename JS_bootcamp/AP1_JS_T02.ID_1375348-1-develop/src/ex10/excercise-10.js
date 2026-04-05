class Ship {
  #name;
  #size;
  #position;
  #hits;
  #startPosition;
  constructor(name, size, position) {
    this.#name = name;
    this.#size = +size;
    this.#position = +position;
    this.#hits = new Array(+size).fill(false);
    this.#startPosition = {
      x: 0,
      y: 0,
    };
  }
  get getName() {
    return this.#name;
  }
  set setName(newName) {
    this.#name = newName;
  }
  get getSize() {
    return this.#size;
  }
  set setSize(newSize) {
    this.#size = newSize;
  }
  get getPosition() {
    return this.#position;
  }
  set setPosition(newPosition) {
    this.#position = newPosition;
  }
  get getHits() {
    return this.#hits;
  }
  set setHits(newHits) {
    this.#hits = newHits;
  }
  get getStartPosition() {
    return this.#startPosition;
  }
  set setStartPosition(newStartPosition) {
    this.#startPosition = newStartPosition;
  }
  hit(n) {
    this.#hits[n] = true;
  }
  isSunk() {
    const sunk = this.#hits.every((hit) => hit === true);
    return sunk;
  }
}

class Board {
  #size;
  #grid;
  #ships;
  constructor(size) {
    this.#size = +size;
    this.#grid = Array.from({ length: +size }, () =>
      new Array(+size).fill(null),
    );
    this.#ships = [];
  }
  get getSize() {
    return this.#size;
  }
  get getGrid() {
    return this.#grid;
  }
  get getShips() {
    return this.#ships;
  }
  set setSize(newSize) {
    this.#size = newSize;
  }
  set setGrid(newGrid) {
    this.#grid = newGrid;
  }
  set setShips(newShips) {
    this.#ships = newShips;
  }

  placeShip(ship, y, x) {
    while (
      (ship.getPosition === 1 && ship.getSize + x > this.#size) ||
      (ship.getSize + y > this.#size && ship.getPosition !== 1) ||
      x > this.#size - 1 ||
      y > this.#size - 1
    ) {
      x = Math.floor(Math.random() * this.#size);
      y = Math.floor(Math.random() * this.#size);
    }
    ship.setStartPosition = { x, y };
    if (ship.getPosition === 1) {
      for (let i = x; i < ship.getSize + x; i++) {
        this.#grid[i][y] = "s";
      }
    } else {
      for (let i = y; i < ship.getSize + y; i++) {
        this.#grid[x][i] = "s";
      }
    }
    this.#ships.push(ship);
  }
  findAvailableCells() {
    let cells = [];
    for (let i = 0; i < this.#size; i++) {
      for (let j = 0; j < this.#size; j++) {
        if (this.#grid[i][j] !== "x" && this.#grid[i][j] !== "-")
          cells.push({ x: i, y: j });
      }
    }
    return cells;
  }
  receiveAttack(x, y) {
    if (this.#grid[x][y] === "s") {
      this.#grid[x][y] = "x";
      for (let ship of this.#ships) {
        const { x: xShip, y: yShip } = ship.getStartPosition;
        if (ship.getPosition === 1) {
          for (let i = xShip; i < ship.getSize + xShip; i++) {
            if (i === x && y === yShip) {
              ship.hit(i - xShip);
            }
          }
        } else {
          for (let i = yShip; i < ship.getSize + yShip; i++) {
            if (x === xShip && i === y) {
              ship.hit(i - yShip);
            }
          }
        }
      }

      return true;
    } else if (this.#grid[x][y] === null) {
      this.#grid[x][y] = "-";
    }
    return false;
  }

  display() {
    let output = "";

    for (let i = 0; i < this.#size; i++) {
      let line = "";

      for (let j = 0; j < this.#size; j++) {
        line += this.#grid[i][j] === null ? "o" : this.#grid[i][j];
      }

      output += line + "\n";
    }

    console.log(output);
  }
}

class Player {
  constructor(name, boardSize) {
    this._name = name;
    this._boardSize = boardSize;
    this._board = new Board(boardSize);
  }
  getName() {
    return this._name;
  }
  getBoardSize() {
    return this._boardSize;
  }
  setName(name) {
    this._name = name;
  }
  setBoardSize(size) {
    this._boardSize = size;
  }
  getBoard() {
    return this._board;
  }
  placeShips(shipName, length, isVertical, startPosition, playerType = 1) {
    let ship = new Ship(shipName, length, isVertical);
    ship.setStartPosition = startPosition;
    if (playerType)
      this._board.placeShip(ship, startPosition.y, startPosition.x);
    else this._board.placeShip(ship, startPosition.y, startPosition.x, 0);
    return ship;
  }

  async takeTurn(opponent) {
    let input = prompt("Введите координаты корабля оппонента:");
    const [x, y] = input.trim().split(" ");
    let obj = {
      x: x,
      y: y,
      opponent: opponent,
    };
    return obj;
  }
}

class App {
  constructor(size, maxLength, maxShips) {
    this._size = size;
    this._maxLength = maxLength;
    this._maxShips = maxShips;
  }
  getSize() {
    return this._size;
  }
  getMaxLength() {
    return this._maxLength;
  }
  getMaxShips() {
    return this._maxShips;
  }
  setSize(newSize) {
    this._size = newSize;
  }
  setMaxLength(length) {
    this._maxLength = length;
  }
  setMaxShips(ships) {
    this._maxShips = ships;
  }
  firstPlayer;
  secondPlayer;
  shipArrangement(player, shipCount, maxShipLength) {
    let shipsDataToOutput = "";

    for (let i = 0; i < shipCount; i++) {
      let size = 1 + Math.floor(Math.random() * maxShipLength);
      let position = Math.floor(Math.random() * 2);
      let y = Math.floor(Math.random() * this._size);
      let x = Math.floor(Math.random() * this._size);
      let ship = player.placeShips(`Корабль ${i}`, size, position, { x, y }, 0);
      shipsDataToOutput += `${size} ${ship.getStartPosition.y},${ship.getStartPosition.x} ${position}\n`;
    }

    return shipsDataToOutput;
  }

  async run() {
    let input0 = prompt(
      "Введите имена игроков, размер доски, максимальный размер кораблей и количество кораблей:",
    );
    let newInput = input0.trim().split(" ");
    let bsize = newInput[2];
    let outputString = "";

    const nameAi0 = newInput[0];
    const shipCountAi0 = +newInput[4];
    const lengthShipAi0 = 1 + Math.floor(Math.random() * newInput[3]);
    let player1 = new AIPlayer(nameAi0, bsize);
    outputString += `${nameAi0} ${shipCountAi0} `;
    outputString += this.shipArrangement(
      player1,
      shipCountAi0,
      lengthShipAi0,
      0,
    );
    player1.getBoard().display();

    const nameAi = newInput[1];
    const shipCountAi = +newInput[4];
    const lengthShipAi = 1 + Math.floor(Math.random() * newInput[3]);
    let player2 = new AIPlayer(nameAi, bsize);
    outputString += `${nameAi} ${shipCountAi} `;
    outputString += this.shipArrangement(player2, shipCountAi, lengthShipAi, 0);
    player2.getBoard().display();

    let win = false;
    let winner;
    let cnt = 1;

    function displayOpponentBoard(opponent, name) {
      let output = "";

      for (let i = 0; i < bsize; i++) {
        let line = "";

        for (let j = 0; j < bsize; j++) {
          if (opponent.getBoard().getGrid[i][j] === null) line += "o";
          else if (opponent.getBoard().getGrid[i][j] === "x") line += "x";
          else if (opponent.getBoard().getGrid[i][j] === "s") line += "o";
          else if (opponent.getBoard().getGrid[i][j] === "-") line += "-";
        }

        output += line + "\n";
      }
      console.log(`Ход игрока ${name}:\n${output}`);
    }

    while (!win) {
      let player = cnt % 2 == 0 ? player2 : player1;
      let opponent = cnt % 2 == 0 ? player1 : player2;

      displayOpponentBoard(opponent, player.getName());

      let inputObject = await player.takeTurn(opponent);

      let { x, y } = inputObject;

      console.clear();
      console.log(`${player.getName()} (${x},${y})`);

      opponent.getBoard().receiveAttack(y, x);
      let flagS = false;

      for (let i = 0; i < bsize; i++) {
        for (let j = 0; j < bsize; j++) {
          if (opponent.getBoard().getGrid[i][j] == "s") flagS = true;
        }
      }

      if (!flagS) {
        win = true;
        winner = player.getName();
        console.clear();
        displayOpponentBoard(opponent, player.getName());
        break;
      }

      [player, opponent] = [opponent, player];
      cnt++;
    }

    console.log(outputString);
    console.log(`Победил ${winner}! Congrats :)`);

    player1.getBoard().display();
    player2.getBoard().display();
    console.log(winner);
  }
}

class AIPlayer extends Player {
  constructor(name, boardSize) {
    super(name, boardSize);
  }

  placeShips(shipName, length, isVertical, startPosition, playerType = 1) {
    let ship = new Ship(shipName, length, isVertical);
    ship.setStartPosition = startPosition;
    this._board.placeShip(ship, startPosition.y, startPosition.x, playerType);
    return ship;
  }

  async takeTurn(opponent) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let masCells = opponent.getBoard().findAvailableCells();
        let cellLength = +opponent.getBoard().findAvailableCells().length;
        let randomCell = masCells[Math.floor(Math.random() * cellLength)];

        let x = randomCell.y;
        let y = randomCell.x;

        resolve({
          x,
          y,
          opponent,
        });
      }, 500);
    });
  }
}

let app = new App(5, 3, 1);
app.run();
