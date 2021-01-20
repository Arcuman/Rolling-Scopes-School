import sound from "./assets/sound.mp3";
import "./styles/main.scss";
import Controller from "./model/Controller";

const controller = new Controller(sound);
controller.init();
