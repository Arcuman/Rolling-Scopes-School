/* eslint-disable arrow-body-style,quotes */
import Helpers from "../../../js/Utils/Helpers";
import createElement from "../../../js/Utils/createElement";

const Win = () => {
    const audio = new Audio("assets/audio/success.mp3");
    audio.play();
    Helpers.sleep(2500).then(() => {
        // eslint-disable-next-line no-restricted-globals
        location.hash = "/";
    });
    const win = createElement("div", "win");
    win.innerHTML = `<img src="assets/img/congratulation.png" alt="Win"/>`;
    return win;
};
export default Win;
