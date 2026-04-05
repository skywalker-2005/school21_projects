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

  placeShip(ship, x, y) {
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
        if (this.#grid[i][j] === null) cells.push({ x: i, y: j });
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
    }
    return false;
  }

  display() {
    for (let i = 0; i < this.#size; i++) {
      let line = "";
      for (let j = 0; j < this.#size; j++) {
        line += this.#grid[i][j] === null ? "o" : this.#grid[i][j];
      }
      console.log(`${line}`);
    }
  }
}

let input = prompt("введите разамер поля:");
let board = new Board(input);
let ShipTest = new Ship("ShipTest", 3, 0);
board.placeShip(ShipTest, 0, 0);

console.log(input, board.receiveAttack(0, 0));
