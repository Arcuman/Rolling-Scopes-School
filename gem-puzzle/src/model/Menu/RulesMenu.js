// eslint-disable-next-line import/extensions
import create from "../../utils/create.js";

export default class RulesMenu {
  constructor(visibility, parent) {
    this.visibility = visibility;
    this.backBtn = create("button", "nav__btn", "Go back", null, [
      "screen",
      "main",
    ]);
    this.container = create(
      "div",
      `screen__container ${this.visibility ? "active" : "hidden"}`,
      [
        create("h2", "screen__title", "Rules of Gem Puzzle", null),
        create(
          "p",
          "description",
          "The object of the puzzle is to place the tiles in order by making\n" +
            "sliding moves that use the empty space.",
          null
        ),
        create(
          "p",
          "description",
          " You can save your game and load it later. Or you can just use pause\n" +
            "button. Also you can choose game field size in Settings",
          null
        ),
        this.backBtn,
      ],
      parent,
      ["screen_name", "rules"]
    );
  }
}
