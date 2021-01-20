export default class MenuItem {
  constructor(name, item, parent) {
    this.name = name;
    this.parent = parent;
    this.item = item;
  }

  setVisibility(isVisible) {
    if (isVisible) {
      this.item.container.classList.remove("hidden");
      this.item.container.classList.add("active");
    } else {
      this.item.container.classList.remove("active");
      this.item.container.classList.add("hidden");
    }
    this.item.visibility = isVisible;
  }
}
