import create from "../../utils/create.js";
import MenuItem from "./MenuItem";
import MainMenu from "./MainMenu";
import BestScoreMenu from "./BestScoreMenu";
import RulesMenu from "./RulesMenu";
import WinMessage from "./WinMessage";
import SettingsMenu from "./SettingsMenu";

export default class Menu {
  constructor() {
    this.isVisible = false;
    this.container = create("span", "overlay", null, null);
    this.message = create("div", "message hidden", "Message", this.container);
    this.menuItems = this.generateMenuItems();
  }

  generateMenuItems() {
    return [
      new MenuItem("main", new MainMenu(true, this.container)),
      new MenuItem("settings", new SettingsMenu(false, this.container)),
      new MenuItem("best_scores", new BestScoreMenu(false, this.container)),
      new MenuItem("rules", new RulesMenu(false, this.container)),
      new MenuItem("win", new WinMessage(false, this.container)),
    ];
  }

  getItemByName(name) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.menuItems) {
      if (item.name === name) {
        return item;
      }
    }
    return null;
  }

  setVisibleElem(name) {
    this.menuItems.forEach((item) => {
      item.name === name ? item.setVisibility(true) : item.setVisibility(false);
    });
  }

  getItems() {
    return this.menuItems;
  }

  setMessage(message) {
    this.message.innerHTML = message;
    this.message.classList.remove("hidden");
    setTimeout(() => {
      this.message.classList.add("hidden");
    }, 2000);
  }

  setToBestScore(moves, time, size) {
    const bestScoreController = this.getItemByName("best_scores").item;
    const newScore = {
      date: new Date().toLocaleDateString(),
      moves,
      time,
      size,
    };
    if (bestScoreController.isBestScore(newScore)) {
      bestScoreController.addNewScore(newScore);
    }
  }
}
