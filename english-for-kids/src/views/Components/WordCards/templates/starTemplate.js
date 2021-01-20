/* eslint-disable indent */
import createElement from "../../../../js/Utils/createElement";

export default function wordCardTemplate(isWrong) {
    const star = createElement("div", "star");
    star.innerHTML = `<img src=${
        isWrong ? "assets/img/star.svg" : "assets/img/star-win.svg"
    } alt="star">`;
    return star;
}
