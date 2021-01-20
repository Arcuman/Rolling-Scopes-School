import Header from "./Header";
import Menu from "./Menu/Menu";
import Board from "./Board";
import * as storage from "../storage";
import AStar from "../algorithm/aStar";
import State from "../algorithm/State";

export default class Controller {
  constructor(sound) {
    this.audio = new Audio(sound);
    this.header = new Header(0, "00:00", new Date());
    this.menu = new Menu();
    this.board = new Board(4, this.header, this.menu, this.audio).init();
    this.isAutoRun = false;
  }

  init() {
    this.generatePage();
    this.header.clockStart();
    // Pause button
    this.header.pauseButton.onclick = () => {
      this.header.clockPause();
      this.pause();
    };
    // Resume button
    this.header.resumeButton.onclick = () => {
      this.resume();
      this.header.clockStart();
    };
    // Auto button
    this.header.autoButton.onclick = () => {
      if (!this.isAutoRun) {
        this.isAutoRun = true;
        this.auto();
      }
    };
    // New game
    this.menu.getItemByName("main").item.newGame.onclick = () => {
      this.newGame();
    };
    // Save game
    this.menu.getItemByName("main").item.saveGame.onclick = () => {
      this.saveGame();
    };
    // Load game
    this.menu.getItemByName("main").item.loadGame.onclick = () => {
      this.loadGame();
    };
    // Best scores
    this.menu.getItemByName("main").item.bestScore.onclick = () => {
      this.menu.setVisibleElem("best_scores");
    };
    // Settings
    const settingItem = this.menu.getItemByName("settings").item;
    this.menu.getItemByName("main").item.setting.onclick = () => {
      this.menu.setVisibleElem("settings");
      settingItem.select_box.addEventListener("change", (e) => {
        this.changeSize(e);
      });
    };
    settingItem.sound.addEventListener("click", (e) => {
      e.stopPropagation();
      this.changeSound(settingItem);
    });
    // Rules
    this.menu.getItemByName("main").item.rules.onclick = () => {
      this.menu.setVisibleElem("rules");
    };
    // Back btn
    this.menu.getItems().forEach((menuItem) => {
      if (menuItem.item.backBtn) {
        menuItem.item.backBtn.addEventListener("click", () => {
          this.menu.setVisibleElem("main");
        });
      }
    });
  }

  pause() {
    this.menu.setVisibleElem("main");
    this.menu.container.classList.add("visible");
    this.header.pauseButton.classList.add("hidden-header");
    this.header.resumeButton.classList.remove("hidden-header");
  }

  resume() {
    this.menu.container.classList.remove("visible");
    this.header.pauseButton.classList.remove("hidden-header");
    this.header.resumeButton.classList.add("hidden-header");
  }

  auto() {
    if (this.menu.container.classList.contains("visible")) return;
    this.header.pauseButton.classList.add("hidden-header");
    const termArr = [];
    for (let i = 1; i <= this.board.nTiles; i++) {
      termArr.push(i);
    }
    termArr.push(0);
    const astar = new AStar(this.board.size, termArr);
    const field = this.board.tiles.map((tile) => tile.number);
    const arrOfTiles = astar.search(new State(null, field));
    let i = 0;
    const timerId = setInterval(() => {
      if (i === arrOfTiles.length - 1) {
        clearInterval(timerId);
        this.isAutoRun = false;
        return;
      }
      const j = i + 1;
      const oldEmptyIndex = arrOfTiles[i].indexOf(0);
      const number = arrOfTiles[j][oldEmptyIndex];
      const oldIndex = arrOfTiles[i].indexOf(number);
      this.board.move(oldIndex, oldEmptyIndex, true);
      i++;
    }, 300);
  }

  newGame() {
    this.header.clockStop();
    this.header.clockStart();
    this.header.setCountOfMoves(0);
    this.resume();
    this.menu.container.classList.remove("visible");
    this.board.reset(this.board.size);
    do {
      this.board.shuffle();
    } while (!this.board.isSolvable());
    this.board.renderTiles();
  }

  saveGame() {
    const sequenceOfArr = [];
    this.board.tiles.forEach((tile) => {
      sequenceOfArr.push(tile.number);
    });
    const save = {
      board: sequenceOfArr,
      time: this.header.elapsedTime,
      moves: this.header.countOfmoves,
    };
    storage.set("Save", save);
    this.menu.setMessage("Success save");
  }

  loadGame() {
    const save = storage.get("Save");
    if (save) {
      this.header.setTime(save.time);
      this.header.setCountOfMoves(save.moves);
      this.board.setTiles(save.board);
      this.menu.getItemByName("settings").item.select_box.value = Math.sqrt(
        save.board.length
      );
      this.menu.setMessage("Success load");
    } else {
      this.menu.setMessage("Nothing to load");
    }
  }

  generatePage() {
    document.body.innerHTML = "";
    document.body.prepend(this.board.container);
    document.body.prepend(this.header.container);
    this.board.setTileImage();
    this.board.renderTiles();
  }

  changeSize(e) {
    const newSize = e.target.value;
    if (+newSize !== this.board.size) {
      this.board.size = +newSize;
      this.menu.setMessage(
        "Changes saved!\n Start new game to get new field size"
      );
    }
  }

  changeSound(sett) {
    this.board.isSoundOn = !this.board.isSoundOn;
    sett.changeSound(this.board.isSoundOn);
  }
}
