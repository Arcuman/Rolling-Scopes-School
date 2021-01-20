import create from "../../utils/create.js";
import * as storage from "../../storage";

export default class BestScoreMenu {
  constructor(visibility, parent) {
    this.bestScores = [];
    this.visibility = visibility;
    this.backBtn = create("button", "nav__btn best__btn", "Go back", null, [
      "screen",
      "main",
    ]);
    this.container = create(
      "div",
      `screen__container ${this.visibility ? "active" : "hidden"}`,
      [
        create("h2", "screen__title best__title", "Best scores", null),
        this.backBtn,
      ],
      parent,
      ["screen_name", "main"]
    );
    this.renderTemplate();
    this.renderScores();
  }

  addNewScore(newScore) {
    this.bestScores = storage.get("bestScores") || [];
    if (this.bestScores.length >= 10) {
      this.bestScores.pop();
    }
    this.bestScores.push(newScore);
    this.sortByMoves();
    storage.set("bestScores", this.bestScores);
    this.renderTemplate();
    this.renderScores();
  }

  isBestScore(newScore) {
    let flag = false;
    this.bestScores = storage.get("bestScores");
    if (!this.bestScores || this.bestScores.length < 10) {
      flag = true;
    } else {
      this.bestScores.forEach((score) => {
        if (newScore.moves < score.moves) {
          flag = true;
        }
      });
    }
    return flag;
  }

  sortByMoves() {
    this.bestScores.sort((a, b) => a.moves - b.moves);
  }

  renderTemplate() {
    this.dateDiv = create(
      "div",
      "date",
      create("div", "subtitle", "Date", null),
      null
    );
    this.movesDiv = create(
      "div",
      "moves",
      create("div", "subtitle", "Moves", null),
      null
    );
    this.sizeDiv = create(
      "div",
      "size",
      create("div", "subtitle", "Size", null),
      null
    );
    this.timeDiv = create(
      "div",
      "time",
      create("div", "subtitle", "Time", null),
      null
    );
    this.result ? this.result.remove() : "";
    this.result = create(
      "div",
      "results",
      [this.dateDiv, this.movesDiv, this.sizeDiv, this.timeDiv],
      this.container
    );
  }

  renderScores() {
    this.bestScores = storage.get("bestScores") || [];
    this.bestScores.forEach((score) => {
      this.dateDiv.append(create("div", null, `${score.date}`, null));
      this.movesDiv.append(create("div", null, `${score.moves}`, null));
      this.sizeDiv.append(create("div", null, `${score.size}`, null));
      this.timeDiv.append(
        create("div", null, `${BestScoreMenu.getTime(score.time)}`, null)
      );
    });
  }

  static getTime(time) {
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
