class KeyboardState {
  constructor() {
    this.keys = {};
    this._onKeyDown = (event) => this._onKeyChange(event, true);
    this._onKeyUp = (event) => this._onKeyChange(event, false);
    document.addEventListener("keydown", this._onKeyDown, false);
    document.addEventListener("keyup", this._onKeyUp, false);
  }

  _onKeyChange(event, isPressed) {
    this.keys[event.key] = isPressed;
  }

  pressed(keyDesc) {
    const pressed = Object.keys(this.keys).includes(keyDesc)
      ? this.keys[keyDesc]
      : false;
    return pressed;
  }
}

export default KeyboardState;
