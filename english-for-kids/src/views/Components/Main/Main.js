/* eslint-disable */
import createElement from "../../../js/Utils/createElement";
import Helpers from "../../../js/Utils/Helpers";

export function MainInit() {
    const main = createElement("div", "main-container");
    document.body.prepend(main);
}

function createParsedUrl(request) {
    return (
        (request.resource ? `/${request.resource}` : "/") +
        (request.id ? "/:id" : "") +
        (request.verb ? `/${request.verb}` : "")
    );
}

// TODO: How to stop block render if state the same ?
export function Main(state, getPage) {
    const main = document.querySelector(".main-container");
    const url = state.url.value;
    const request = Helpers.parseRequestURL(url);

    main.innerHTML = "";
    switch (request.resource) {
        case "":
        case "categories":
            main.appendChild(getPage("Categories"));
            break;
        case "category":
            main.appendChild(getPage("Cards"));
            break;
        case "stats":
            main.appendChild(getPage("Stats"));
            break;
        case "win":
            main.appendChild(getPage("Win"));
            break;
        case "fail":
            main.appendChild(getPage("Fail"));
            break;
        default:
            break;
    }
}
