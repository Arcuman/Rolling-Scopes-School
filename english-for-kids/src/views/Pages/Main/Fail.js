import Helpers from "../../../js/Utils/Helpers";
import createElement from "../../../js/Utils/createElement";

const Fail = (state) => {
    const audio = new Audio("assets/audio/failure.mp3");
    audio.play();
    Helpers.sleep(2500).then(() => {
        // eslint-disable-next-line no-restricted-globals
        location.hash = "/";
    });
    const fail = createElement("div", "fail");
    fail.innerHTML = `
        <div>
            <div class="fail-wrapper">
                <span>Errors: </span>
                <span id="counter">${state.audioArray.wrongAnswers}</span>
            </div>
            <img src="assets/img/failure.png" alt="Failure"/>
        </div>
        `;
    return fail;
};
export default Fail;
