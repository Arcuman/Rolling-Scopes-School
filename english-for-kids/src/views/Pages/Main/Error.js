/* eslint-disable implicit-arrow-linebreak,comma-dangle */
import createElement from "../../../js/Utils/createElement";

export default function Error(msg) {
    const error = createElement("div", "error");
    error.innerHTML = msg;
    return error;
}
