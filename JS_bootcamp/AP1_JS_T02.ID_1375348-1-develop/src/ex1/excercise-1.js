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

let input = prompt("введите имя, длину и расположение корабля:");
const [name, size, position] = input.trim().split(" ");
const ship1 = new Ship(name, size, position);
ship1.hit(0);
ship1.hit(1);

console.log(
  `${ship1.getName}, ${ship1.getSize}, ${ship1.getPosition}, ${ship1.isSunk()}`,
);
