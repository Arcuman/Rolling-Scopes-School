// eslint-disable-next-line import/extensions
import create from "../../utils/create.js";

export default class SettingsMenu {
  constructor(visibility, parent) {
    this.visibility = visibility;
    this.sound = create("button", "nav__btn", "Sound: On", null, [
      "screen",
      "main",
    ]);
    this.backBtn = create("button", "nav__btn", "Go back", null, [
      "screen",
      "main",
    ]);
    this.select_box = create(
      "select",
      "select-box",
      [
        create("option", "select-option", "3x3", null, ["value", 3]),
        create(
          "option",
          "select-option",
          "4x4",
          null,
          ["selected", ""],
          ["value", 4]
        ),
        create("option", "select-option", "5x5", null, ["value", 5]),
        create("option", "select-option", "6x6", null, ["value", 6]),
        create("option", "select-option", "7x7", null, ["value", 7]),
        create("option", "select-option", "8x8", null, ["value", 8]),
      ],
      null
    );
    this.container = create(
      "div",
      `screen__container ${this.visibility ? "active" : "hidden"}`,
      [
        create("h2", "screen__title", "Settings", null),
        create(
          "div",
          "info-size",
          [create("label", "info-title", "Field size", null), this.select_box],
          null
        ),
        this.sound,
        this.backBtn,
      ],
      parent,
      ["screen_name", "main"]
    );
  }

  changeSound(isSoundOn) {
    // eslint-disable-next-line no-unused-expressions
    isSoundOn
      ? (this.sound.innerHTML = "Sound: On")
      : (this.sound.innerHTML = "Sound: Off");
  }
}
