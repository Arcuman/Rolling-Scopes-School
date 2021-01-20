import create from "../utils/create.js";

export default class Tile {
  constructor(number, classList) {
    this.number = number;
    this.container = create(
      "div",
      `${classList}`,
      number !== 0 ? number.toString() : null,
      null,
      ["data-id", number]
    );
  }
}
