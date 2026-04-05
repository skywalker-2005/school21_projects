import blessed from "blessed";
import EventEmitter from "events";

class InputHandler extends EventEmitter {
  constructor(screen) {
    super();
    this._screen = screen;
    this._registerKeyHandlers();
  }

  _registerKeyHandlers() {
    this._screen.key(["w", "W", "ц", "Ц"], () => {
      this.emit("keypress", "up");
    });

    this._screen.key(["a", "A", "ф", "Ф"], () => {
      this.emit("keypress", "left");
    });

    this._screen.key(["s", "S", "ы", "Ы"], () => {
      this.emit("keypress", "down");
    });

    this._screen.key(["d", "D", "в", "В"], () => {
      this.emit("keypress", "right");
    });

    this._screen.key(["h", "H", "р", "Р"], () => {
      this.emit("keypress", "weapon");
    });

    this._screen.key(["j", "J", "о", "О"], () => {
      this.emit("keypress", "eat");
    });

    this._screen.key(["k", "K", "л", "Л"], () => {
      this.emit("keypress", "potion");
    });

    this._screen.key(["e", "E", "у", "У"], () => {
      this.emit("keypress", "scroll");
    });

    this._screen.key(["enter"], () => {
      this.emit("keypress", "enter");
    });

    this._screen.key(["escape"], () => {
      this.emit("keypress", "escape");
    });

    this._screen.key(["tab", "t", "T"], () => {
      this.emit("keypress", "toggle3d");
    });

    this._screen.key(["space"], () => {
      this.emit("keypress", "menu");
    });

    this._screen.key(["q", "Q", "й", "Й", "C-c"], () => process.exit(0));

    this._screen.key(["0"], () => {
      this.emit("keypress", "0");
    });

    this._screen.key(["1"], () => {
      this.emit("keypress", "1");
    });

    this._screen.key(["2"], () => {
      this.emit("keypress", "2");
    });

    this._screen.key(["3"], () => {
      this.emit("keypress", "3");
    });

    this._screen.key(["4"], () => {
      this.emit("keypress", "4");
    });

    this._screen.key(["5"], () => {
      this.emit("keypress", "5");
    });

    this._screen.key(["6"], () => {
      this.emit("keypress", "6");
    });

    this._screen.key(["7"], () => {
      this.emit("keypress", "7");
    });

    this._screen.key(["8"], () => {
      this.emit("keypress", "8");
    });

    this._screen.key(["9"], () => {
      this.emit("keypress", "9");
    });
  }
}

export default InputHandler;

