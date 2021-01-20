/* eslint-disable no-param-reassign,prefer-const */
// eslint-disable-next-line import/extensions
import create from "../utils/create.js";
import Tile from "./TIle";
import img from "../assets/image.jpg";

export default class Board {
  constructor(size, header, menu, audio) {
    this.size = size;
    this.tiles = [];
    this.menu = menu;
    this.header = header;
    this.audio = audio;
    this.isSoundOn = true;
    this.time = null;
    this.countOfmoves = 0;
    this.container = null;
    this.generateBoard();
  }

  generateBoard() {
    this.container = create("div", "game-board", null, null);

    this.reset(this.size);
    do {
      this.shuffle();
    } while (!this.isSolvable());
    this.renderTiles();
  }

  init() {
    this.container.ondragstart = function () {
      return false;
    };
    this.container.addEventListener("click", (e) => {
      e.stopPropagation();
      this.HandleEvent(e);
    });
    this.container.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      this.HandleEvent(e);
    });
    return this;
  }

  reset(size) {
    if (this.size !== 4 && this.size !== 3) {
      this.header.autoButton.style.visibility = "hidden";
    } else {
      this.header.autoButton.style.visibility = "visible";
    }
    this.size = size;
    this.container.setAttribute(
      "style",
      `grid-template-columns: repeat(${this.size}, 1fr);`
    );
    this.nTiles = this.size ** 2 - 1;
    this.tiles = [];
    for (let i = 1; i <= this.nTiles; i++) {
      const tile = new Tile(i, "tile");
      this.tiles.push(tile);
    }
    this.empty = new Tile(0, "empty");
    this.tiles.push(this.empty);
  }

  setTiles(tileNumbers) {
    this.reset(Math.sqrt(tileNumbers.length));
    this.tiles = [];
    tileNumbers.forEach((tileNumber) => {
      if (tileNumber !== 0) {
        this.tiles.push(new Tile(tileNumber, "tile"));
      } else {
        this.empty = new Tile(tileNumber, "empty");
        this.tiles.push(this.empty);
      }
    });
    this.renderTiles();
  }

  // Random generate tiles
  shuffle() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
  }

  renderTiles() {
    this.setTileImage();
    if (this.container) {
      this.container.innerHTML = "";
    }
    this.tiles.forEach((tile) => {
      this.container.appendChild(tile.container);
    });
    this.container.appendChild(this.menu.container);
  }

  isSolvable() {
    let countInversions = 0;
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].number === 0) {
        continue;
      }
      for (let j = i + 1; j < this.tiles.length; j++) {
        if (this.tiles[j].number === 0) {
          continue;
        }
        if (this.tiles[j].number < this.tiles[i].number) {
          countInversions += 1;
        }
      }
    }
    if (this.tiles.length % 2 === 0) {
      countInversions +=
        // count row of empty tile
        Math.floor(this.tiles.indexOf(this.empty) / this.size) + 1;
    }
    return countInversions % 2 === 0;
  }

  isSolved() {
    for (let i = 0; i < this.tiles.length - 1; i++) {
      if (this.tiles[i].number !== i + 1) {
        return false;
      }
    }
    return true;
  }

  HandleEvent(e) {
    let oldIndex = null;
    let oldEmptyIndex = null;
    const id = +e.target.dataset.id;
    let tile = null;
    if (id && id !== 0) {
      tile = this.tiles.find((ttile) => ttile.number === id);
      oldIndex = this.tiles.indexOf(tile);
      oldEmptyIndex = this.tiles.indexOf(this.empty);
    } else {
      return;
    }
    if (e.type === "mousedown") {
      this.dragAndDropHandler(tile, e, oldIndex, oldEmptyIndex);
    }
  }

  canMove(oldIndex, oldEmptyIndex) {
    const diff = Math.abs(oldIndex - oldEmptyIndex);
    if (diff === 1 || diff === this.size) {
      // check if it is at the beginning or end of the line
      // so that the last to the previous or the first trace in the line are not included
      return !(
        (oldEmptyIndex % this.size === 0 && oldIndex + 1 === oldEmptyIndex) ||
        (oldEmptyIndex % this.size === this.size - 1 &&
          oldIndex - 1 === oldEmptyIndex)
      );
    }
    return false;
  }

  move(oldIndex, oldEmptyIndex, isClick) {
    // animation
    if (isClick) {
      this.tiles[oldIndex].container.classList.add("opacityHide");
    }
    [this.tiles[oldEmptyIndex], this.tiles[oldIndex]] = [
      this.tiles[oldIndex],
      this.tiles[oldEmptyIndex],
    ];
    if (this.isSoundOn) {
      this.audio.play();
    }
    if (isClick) {
      let isShowEnd = false;
      this.tiles[oldEmptyIndex].container.addEventListener(
        "animationend",
        () => {
          this.tiles[oldEmptyIndex].container.classList.remove("opacityHide");
          this.renderTiles();
          if (!isShowEnd) {
            this.tiles[oldEmptyIndex].container.classList.add("opacityShow");
            isShowEnd = true;
          } else {
            this.tiles[oldEmptyIndex].container.classList.remove("opacityShow");
            this.tiles[
              oldEmptyIndex
            ].container.addEventListener.onanimationend = null;
          }
        }
      );
    } else {
      this.renderTiles();
    }
    this.header.addCountOfMoves();
    if (this.isSolved()) {
      this.menu
        .getItemByName("win")
        .item.setWinMessage(
          this.header.countOfmoves,
          this.header.elapsedTime,
          this.size
        );
      this.menu.setToBestScore(
        this.header.countOfmoves,
        this.header.elapsedTime,
        this.size
      );
      this.header.clockStop();
      this.header.setCountOfMoves(0);
      this.header.pauseButton.classList.add("hidden-header");
      this.menu.setVisibleElem("win");
      this.menu.container.classList.add("visible");
    }
  }

  dragAndDropHandler(tile, e, oldIndex, oldEmptyIndex) {
    // Tile which will move
    let tempTile = new Tile(tile.number, "tile");
    this.setImage(tempTile);
    this.container.appendChild(tempTile.container);
    let height = e.target.offsetHeight;
    let width = e.target.offsetWidth;
    // Are we above the empty tile or no
    let isUnderEmpty = false;
    // Get position relative to cursor
    let shiftX = e.clientX - tile.container.getBoundingClientRect().left;
    let shiftY = e.clientY - tile.container.getBoundingClientRect().top;
    // hidden our tile while we drag our tempTile (because if we will set absolute to this tile,
    // grid will be displaced on 1 tile )
    tile.container.classList.remove("tile");
    tile.container.classList.add("empty-drag");
    tempTile.container.classList.add("drag");
    tempTile.container.style.width = `${width}px`;
    tempTile.container.style.height = `${height}px`;
    this.moveAt(e.pageX, e.pageY, tempTile, shiftX, shiftY);

    // eslint-disable-next-line no-shadow
    let onMouseMove = (e) => {
      // see what lies under our cursor
      tempTile.container.style.visibility = "hidden";
      let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
      tempTile.container.style.visibility = "visible";
      // if our cursor is outside the window
      if (!elemBelow) {
        this.container.onmouseup(e);
      }
      let droppableBelow = elemBelow.closest(".empty");
      // set flag if we above empty tile
      droppableBelow ? (isUnderEmpty = true) : (isUnderEmpty = false);
      this.moveAt(e.pageX, e.pageY, tempTile, shiftX, shiftY);
    };
    // add event listener here cause we need to track mouse after mousedown
    document.addEventListener("mousemove", onMouseMove);
    this.container.onmouseup = () => {
      // Get position relative to cursor
      let shiftXEnd =
        e.clientX - tempTile.container.getBoundingClientRect().left;
      let shiftYEnd =
        e.clientY - tempTile.container.getBoundingClientRect().top;
      // This variable need us to count offset our tile from start position
      let diffX = shiftXEnd - shiftX;
      let diffY = shiftYEnd - shiftY;
      let offset = Math.floor(Math.abs(diffX + diffY));

      document.removeEventListener("mousemove", onMouseMove);
      tempTile.container.remove();
      tile.container.classList.remove("empty-drag");
      tile.container.classList.add("tile");
      // Check is it was drag&drop or click
      // TODO: check cursor delay time
      if (offset < 7) {
        // if click
        if (this.canMove(oldIndex, oldEmptyIndex)) {
          this.move(oldIndex, oldEmptyIndex);
        }
      } else if (this.canMove(oldIndex, oldEmptyIndex) && isUnderEmpty) {
        this.move(oldIndex, oldEmptyIndex);
      }
      this.container.onmouseup = null;
    };
  }

  moveAt = (pageX, pageY, tile, shiftX, shiftY) => {
    tile.container.style.left = `${
      pageX - this.container.offsetLeft - shiftX
    }px`;
    tile.container.style.top = `${pageY - this.container.offsetTop - shiftY}px`;
  };

  setTileImage() {
    this.tiles.forEach((tile) => {
      this.setImage(tile);
    });
  }

  setImage(tile) {
    const board = window.getComputedStyle(this.container);
    const widthImage = board.width;
    if (!widthImage) {
      return;
    }
    const col = (tile.number - 1) % this.size;
    const row = Math.floor((tile.number - 1) / this.size);
    const k = /\d+/.exec(widthImage)[0] / this.size;
    if (tile.number !== 0) {
      tile.container.setAttribute(
        "style",
        `
          background-size:  ${widthImage};
          background-image: url(${img});
        background-position-x: -${col * k}px  ;
        background-position-y:  -${row * k}px ;`
      );
    }
  }
}
