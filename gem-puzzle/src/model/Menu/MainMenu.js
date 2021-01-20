import create from "../../utils/create.js";

export default class MainMenu {
  constructor(visibility, parent) {
    this.visibility = visibility;
    this.newGame = create("button", "nav__btn", "New Game", null);
    this.saveGame = create("button", "nav__btn", "Save Game", null);
    this.loadGame = create("button", "nav__btn", "Load Game", null, [
      "screen",
      "best_scores",
    ]);
    this.bestScore = create("button", "nav__btn", "Best scores", null, [
      "screen",
      "best_scores",
    ]);
    this.rules = create("button", "nav__btn", "Rules", null, [
      "screen",
      "best_scores",
    ]);
    this.setting = create("button", "nav__btn", "Settings", null, [
      "screen",
      "best_scores",
    ]);
    this.container = create(
      "div",
      `screen__container ${this.visibility ? "active" : "hidden"}`,
      [
        this.newGame,
        this.saveGame,
        this.loadGame,
        this.bestScore,
        this.rules,
        this.setting,
      ],
      parent,
      ["screen_name", "main"]
    );
  }
}
