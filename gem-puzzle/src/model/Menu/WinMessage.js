// eslint-disable-next-line import/extensions
import create from "../../utils/create.js";

export default class WinMessage {
  constructor(visibility, parent) {
    this.visibility = visibility;
    this.message = create("h2", "screen__title", "", null);
    this.backBtn = create("button", "nav__btn", "Go back", null, [
      "screen",
      "main",
    ]);
    this.container = create(
      "div",
      `screen__container ${this.visibility ? "active" : "hidden"}`,
      [this.message, this.backBtn],
      parent,
      ["screen_name", "win"]
    );
  }

  setWinMessage(moves, times, size) {
    this.message.innerHTML = `Congratulations, it took you ${moves} moves and ${this.getTime(
      times
    )} to solve the ${size}x${size} puzzle`;
  }

  // eslint-disable-next-line class-methods-use-this
  getTime(time) {
    let t = time;
    t = Math.floor(t / 1000);
    let s = t % 60;
    t -= s;
    t = Math.floor(t / 60);
    let m = t % 60;
    if (m < 10) m = `0${m}`;
    if (s < 10) s = `0${s}`;
    return `${m}:${s}`;
  }
}
