import create from "../utils/create.js";

export default class Header {
  constructor(movesCount, time, startDate) {
    this.countOfmoves = movesCount;
    this.time = time;
    this.startTime = startDate;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.container = create("header", "header", null, null);
    this.timeNumbers = create("span", null, `${this.time}`, null);
    this.movesCount = create("span", null, `${this.countOfmoves}`, null);
    create(
      "div",
      "time",
      [create("span", null, "Time: ", null), this.timeNumbers],
      this.container
    );
    create(
      "div",
      "time",
      [create("span", null, "Moves: ", null), this.movesCount],
      this.container
    );
    this.autoButton = create(
      "div",
      "pause tooltip",
      [
        create("span", null, "AutoEnd", null),
        create(
          "span",
          "tooltiptext",
          "The search algorithm can take up to 5 seconds, and the algorithm is not the best, the number of moves can reach 500."
        ),
      ],
      this.container
    );
    this.pauseButton = create("div", "pause", "Pause game", this.container);
    this.resumeButton = create(
      "div",
      "pause hidden-header",
      "Resume game",
      this.container
    );
  }

  addCountOfMoves() {
    this.countOfmoves++;
    this.movesCount.innerText = this.countOfmoves;
  }

  setCountOfMoves(moves) {
    this.countOfmoves = moves;
    this.movesCount.innerText = this.countOfmoves;
  }

  setTime(time) {
    this.elapsedTime = time;
    this.updateTime(this.elapsedTime);
  }

  clockStart() {
    this.startTime = Date.now() - this.elapsedTime;
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.updateTime(this.elapsedTime);
    }, 1000);
  }

  clockPause() {
    clearInterval(this.timerInterval);
  }

  clockStop() {
    this.timeNumbers.innerHTML = "00:00";
    clearInterval(this.timerInterval);
    this.elapsedTime = 0;
  }

  updateTime(time) {
    let t = time;
    t = Math.floor(t / 1000);
    let s = t % 60;
    t -= s;
    t = Math.floor(t / 60);
    let m = t % 60;
    if (m < 10) m = `0${m}`;
    if (s < 10) s = `0${s}`;
    this.timeNumbers.innerHTML = `${m}:${s}`;
  }
}
